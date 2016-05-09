// install express & dependancies
var ejs             = require('ejs'),
    faker           = require('faker'),
    express         = require('express'),
    passport        = require('passport'),
    mongoose        = require('mongoose'),
    seedDB          = require('./seed.js'),
    bodyParser      = require('body-parser'),
    User            = require('./models/user'),
    LocalStrategy   = require('passport-local'),
    Product         = require('./models/product'),
    methodOverride  = require ('method-override'),
    setUserGroup    = require('./setUserGroup.js');



//Development configuration
var devMode = {
    // set true to enable dev functions
    active      : false,
    // set up properties of seedConfig
    seedConfig  : {
        // set true to run seed script on startup 
        active  : false,
        // delete all users
        users   : false,
        // delete all products
        products: false,
        // how many products to seed
        quantity: 100,
        // log events
        feedback: true
        
    },
    // set up properties of giveAdmin
    giveAdmin   : {
        // use giveAdmin on startup?
       active   : false,
       // target user id
       id       : '',
       // desired group name - standard: Admin
       group    : 'Admin'
    }
};


mongoose.connect(process.env.DATABASEURL);
//////////////////////////////////////////////////////////////////
////////////Initialize express
//////////////////////////////////////////////////////////////
var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.bodyParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));

// dev mode
if (devMode.active === true){
    // check if we should seed the database
    if (devMode.seedConfig.active === true){
        seedDB(devMode.seedConfig);
    }
    // check if we should bestow admin to a user
    if (devMode.giveAdmin.active === true){
        setUserGroup(devMode.giveAdmin.id, devMode.giveAdmin.group);
    }
}


//////////////////////////////////////////////////////////////////
////////////Passport configuration
//////////////////////////////////////////////////////////////

app.use(require('express-session')({
    secret: process.env.OURSECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});



//////////////////////////////////////////////////////////////////
////////////Auth routes
//////////////////////////////////////////////////////////////

// registration logic
app.post('/register', function(req, res){
    var newUser = new User({username: req.body.username, userInfo: { deleteme : 'placeholder value' }});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err);
            res.redirect('/#/register-taken');
        } else {
        passport.authenticate('local')(req, res, function(){
            res.redirect('/');
        });
        }
    });

})

// login logic
app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/#/login'
    }), function(req, res){
    
})

// logout route
app.get('/logout', function(req, res) {
   console.log('user logging out: username: ' + req.user.username + ' id: ' + req.user._id);
   req.logout();
   res.redirect('/');
});


// Auth logic 
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        var fillerObj = {
            errorMessage : 'You\'re not logged in friend.',
            notAuth : true
        };
    res.send(fillerObj);
    }

}

function isAdmin(req, res, next){
        User.findById(req.user._id, function(err, user) {
        if (err){
            console.log('profile info route error : ' + err);
        }else {
            if (user.userGroup === 'admin'){
                return next();
            } else {
                res.send ('not an admin');
            }
        }

    }); 
    
}

//////////////////////////////////////////////////////////////////
////////////Profile routes
//////////////////////////////////////////////////////////////

//user profile get route
app.get('/profile',isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, user) {
        if (err){
            console.log('profile info route error : ' + err);
        }else {
            res.send(user.userInfo); 
        }

    });   

});

// user profile update route 
app.put('/profile',isLoggedIn, function(req, res){

    //-------------------------------------- MONGOOSE UPDATE USER
    //Update data of currently logged in user
    User.findByIdAndUpdate(req.user._id, {
        // SET UP userInfo OBJECT BASED ON REQUEST DATA
        $set: {
            userInfo : {
                fname: req.body.fname,
                lname: req.body.lname,
                address: req.body.address,
                country: req.body.country,
                city: req.body.city,
                postal : req.body.postalinput
            }
        }},
        // TELL MONGOOSE TO SHOW NEW DOCUMENT WHEN FINISHED
        {new : true },
        // CALLBACK 
        function(err, updatedUser) {
        if (err){
            console.log('profile info route error : ' + err);
        }else {
            res.redirect('/#/profile');
        }

    }); 
    //------------------------------------------- END MONGOOSE UPDATE USER

});

// DESTROY USER ACCOUNT ROUTE
app.delete('/profile', isLoggedIn, function(req, res){
    User.findByIdAndRemove(req.user._id, function(err){
       if(err){
            res.send(err);
       } else {
           res.send('sucessfully deleted profile');
       }
    });
});
//////////////////////////////////////////////////////////////////
////////////Other routes
//////////////////////////////////////////////////////////////

//  '/' => render index view
app.get('/', function(req, res){
   res.sendfile('./public/app/index.htm'); // load the single view file (angular will handle the page changes on the front-end)
});

// debug user
app.get('/user', function(req, res){
    if (!req.user){
        res.send();
    } else {
        res.send(req.user.username);  
    }
   
});

// retrieve all products
app.get('/products', function(req, res) {
    Product.find({}, function(err, products) {
        if (err){
            console.log('products route error : ' + err);
        }else {
            res.send(products); 
        }

    });
});

// alternative product details route -- handled by angular using /products
// app.get('/details/:id', function(req, res) {
//     Product.findById(req.params.id, function(err, theProduct) {
//         if (err){
//             console.log('product route error : ' + err);
//         }else {
//             res.send(theProduct); 
//         }

//     });
// });

// AUTH TESTING
// app.get('/secret',isLoggedIn, function(req, res){
//     // use this route to debug auth 
//   res.send('secret data');
// });

// app.get('/admintest', isLoggedIn, isAdmin, function(req, res){
//     res.send('account passed admin auth test');
// });


// Catch all
app.get('*', function(req, res){
   res.send('The path doesn\'t exist');
});



//////////////////////////////////////////////////////////////////
//////////// Tell Express to listen for requests (start server)
//////////////////////////////////////////////////////////////

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server has started');
}); 
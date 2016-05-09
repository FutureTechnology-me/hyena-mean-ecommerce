var mongoose = require("mongoose");
var User = require ("./models/user");
    
var setUserGroup = function(userID, userGroup) {
    User.findByIdAndUpdate(userID, { userGroup: userGroup }, function(err, user) {
        if (err){
            console.log('there was an error setting up admin: ' + err );
        }else {
            console.log('User: ' + user.username + ' is now in the userGroup: ' + JSON.stringify(user.userGroup));
        }
    });
};


module.exports = setUserGroup;
    


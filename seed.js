//////////////////////////////////////////////////////////////////
////////////Seed script - this is where we clean / seed the database during development
//////////////////////////////////////////////////////////////

var mongoose = require("mongoose");
var User = require ("./models/user");
var Product = require ("./models/product");
var faker = require("faker");


function cleanDB(){
    // Remove all Users
    // User.remove({}, function(err){
    //     if (err){
    //         console.log(err);
    //     } else {
    //         console.log("Removed Users");
    //     };
    //     })
    // Remove all Products
    Product.remove({}, function(err){
        if (err){
            console.log(err);
        } else {
            console.log("Removed Items");
        };
        })
        
    };

function seedDB(){

cleanDB();
    // seed the database with 100 products using faker
    for(var i = 0; i < 100; i++){
        var productSeed = new Object();
        
        productSeed.color = faker.commerce.color();
        productSeed.department = faker.commerce.department();
        productSeed.price = faker.commerce.price();
        productSeed.productAdjective = faker.commerce.productAdjective();
        productSeed.productMaterial = faker.commerce.productMaterial();
        productSeed.productDescription = faker.lorem.paragraph();
        productSeed.productName = productSeed.productAdjective + ' ' + productSeed.productMaterial + ' ' + faker.commerce.product();
        var photoroll =  (Math.random() * (10 - 0) + 0).toFixed(0);
        console.log(photoroll + '-----------------------------------------------------');
        switch(photoroll) {
            case '0':
                console.log('switch hit 0');
                productSeed.imageUrl = '/img/placeholder-dgreen.png';
                break;
            case '1':
                productSeed.imageUrl = '/img/placeholder-blue.png';
                break;
            case '2':
                productSeed.imageUrl = '/img/placeholder-dred.png';
                break;
            case '3':
                productSeed.imageUrl = '/img/placeholder-green.png';
                break;
            case '4':
                productSeed.imageUrl = '/img/placeholder-orange.png';
                break;
            case '5':
                console.log('switch hit 5');
                productSeed.imageUrl = '/img/placeholder-pink.png';
                break;
            case '6':
                productSeed.imageUrl = '/img/placeholder-purple.png';
                break;
            case '7':
                productSeed.imageUrl = '/img/placeholder-red.png';
                break;
            case '8':
                productSeed.imageUrl = '/img/placeholder-teal.png';
                break;
            case '9':
                productSeed.imageUrl = '/img/placeholder-yellow.png';
                break;
            default:
            console.log('switch hit default');
            console.log(photoroll)
                productSeed.imageUrl = '/img/placeholder-dgreen.png' ;
                break;
        }
        
        Product.create(productSeed, function(err, product){
            if(err){
                console.log(err);
            } else {
                console.log("added a product : " + product);
            }
        })
    }
}
module.exports = seedDB;



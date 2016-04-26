var mongoose = require("mongoose");

var ProductSchema = new mongoose.Schema({
    productName: String,
    color: String,
    department: String,
    price: String,
    productAdjective: String,
    productMaterial: String,
    imageUrl: String,
    productDescription: String
})

module.exports = mongoose.model("Product", ProductSchema);


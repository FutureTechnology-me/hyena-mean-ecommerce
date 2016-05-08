var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    userInfo: Object,
    userGroup: String

})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);

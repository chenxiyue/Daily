var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    lastlogindate: Date
});

module.exports = UserSchema;
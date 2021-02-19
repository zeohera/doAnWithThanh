
const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    name: String,
    account:String,
    phoneNumber:String,
    email: String,
    password: String,
    pro:String,
    avatar:String
})
var User = mongoose.model('User', userSchema, 'users' )

module.exports = User

const mongoose = require('mongoose')
var billSchema = new mongoose.Schema({
    name : String,
    address : String,
    phoneNumber : String,
    items : Array,
    price : Number,
})

var Bill = mongoose.model('Bill', billSchema, 'bills' )

module.exports = Bill
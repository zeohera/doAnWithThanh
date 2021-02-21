
const mongoose = require('mongoose')
var billSchema = new mongoose.Schema({
    name : String,
    address : String,
    phoneNumber : String,
    email : String,
    items : Array,
    price : Number,
    state : Number,
    note : Array,
    shippingInfo : String,
    date : Date
})

var Bill = mongoose.model('Bill', billSchema, 'bills' )

module.exports = Bill

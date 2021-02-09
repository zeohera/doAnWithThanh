
const mongoose = require('mongoose')

var productSchema = new mongoose.Schema({
    name: String,
    brand:String,
    amount: Number,
    image:String,
    description: String,
    introText: String,
    price: Number,
    day: Date,
    type: String,
    Subtype: String
})
var Product = mongoose.model('Product', productSchema, 'products' )

module.exports = Product

const mongoose = require('mongoose')

var productSchema = new mongoose.Schema({
    name: String,
    brand:String,
    amount: Number,
    price: Number,
    image:String,
    description: String,
    introText: String,
    day: Date,
    type: String,
    Subtype: String,
    display: Boolean,

})
var Product = mongoose.model('Product', productSchema, 'products' )

module.exports = Product
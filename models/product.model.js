
const mongoose = require('mongoose')

var productSchema = new mongoose.Schema({
    name: String,
    brand:String,
    amount: Number,
    category: String,
    SubCategory: String,
    price: Number,
    image:String,
    description: String,
    introText: String,
    day: Date,
    public: Boolean,
    new: Boolean,
    discount: Number,
    sound: String
})
var Product = mongoose.model('Product', productSchema, 'products' )

module.exports = Product
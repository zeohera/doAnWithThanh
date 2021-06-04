
const mongoose = require('mongoose')

var productSchema = new mongoose.Schema({
    name: String,
    brand:String,
    amount: Number,
    category: String,
    subCategory: String,
    price: Number,
    image:String,
    description: String,
    introText: String,
    day: Date,
    public: Boolean,
    new: Boolean,
    discountedPrice: Number,
    sound: String,
    refProduct : Array,
    gift : Array,
    public_id : String
})
var Product = mongoose.model('Product', productSchema, 'products' )

module.exports = Product

const mongoose = require('mongoose')

var productCategorySchema = new mongoose.Schema({
    name: String,   
    description:String,
    image :String
})
var productCategory = mongoose.model('productCategory', productCategorySchema, 'productCategories')

module.exports = productCategory
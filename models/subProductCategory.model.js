const mongoose = require('mongoose')

var subProductCategorySchema = new mongoose.Schema({
    mother : String,
    name: String,   
    description:String
})

var subProductCategory = mongoose.model('subProductCategory', subProductCategorySchema, 'subProductCategories')

module.exports = subProductCategory
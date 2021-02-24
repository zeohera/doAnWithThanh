
const mongoose = require('mongoose')
var brandSchema = new mongoose.Schema({
    name : String,
    logo : String,
    description : String,
    image :String,
})

var Brand = mongoose.model('Brand', brandSchema, 'brands' )

module.exports = Brand
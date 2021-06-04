
const mongoose = require('mongoose')
var brandSchema = new mongoose.Schema({
    name : String,
    logo : String,
    image :String,
    public_id_logo :String,
    public_id_image : String,
    description : String,
})

var Brand = mongoose.model('Brand', brandSchema, 'brands' )

module.exports = Brand
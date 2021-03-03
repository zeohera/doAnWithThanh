
const mongoose = require('mongoose')
var bannerSchema = new mongoose.Schema({
    link : String,
    image :String,
    display : Number
})

var Banner = mongoose.model('Banner', bannerSchema, 'banners' )

module.exports = Banner
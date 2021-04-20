const mongoose = require('mongoose')

var districtScheme = new mongoose.Schema({
    name : String,
    city : String
})


var District = mongoose.model('District',districtScheme, 'districts')

module.exports = District
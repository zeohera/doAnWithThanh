
const mongoose = require('mongoose')

var cityScheme = new mongoose.Schema({
    name : String,
})


var City = mongoose.model('City',cityScheme, 'cities')

module.exports = City
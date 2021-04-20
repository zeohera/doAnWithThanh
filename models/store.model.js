
const mongoose = require('mongoose')

var storeScheme = new mongoose.Schema({
    city : String,
    district : String,
    address : String,
    embeddedLink : String,
})

var Store = mongoose.model('Store', storeScheme, 'stores')

module.exports = Store
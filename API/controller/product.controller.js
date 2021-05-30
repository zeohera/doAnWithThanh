
const Product = require('../../models/product.model')
const Store = require('../../models/store.model')
const City = require('../../models/city.model')
const District = require('../../models/district.model')
const Bill = require('../../models/bill.model')
module.exports.index = async function (req, res) {
    console.log('hehehe')
    var product = await Product.find()
    res.header("Access-Control-Allow-Headers")
    res.json(product)
}
module.exports.selectCityStore = async function (req, res) {
    var city = await City.findOne({_id : req.params.id })
    var cityName = city.name
    var district = await District.find({city : cityName})
    var store = await Store.find({city : cityName})
    var data = {store : store, district : district}
    res.json(data)
}
module.exports.getAllCity = async function (req, res){
    var city = await City.find().exec()
    res.json(city)
}

module.exports.getDistrictStore = async function (req, res){
    var district = await District.findOne({_id : req.params.id}).exec()
    var districtName = district.name
    var store = await Store.find({district : districtName})
    res.json(store)

}

module.exports.getBillInfo = async function (req, res) {
    console.log('test',req.query.BillID)
    var bill = await Bill.findOne({_id : req.query.BillID , name : req.query.customerName}).exec()
    res.json(bill)
}
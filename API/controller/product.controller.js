
const Product = require('../../models/product.model')
module.exports.index = async function (req, res) {
    var product = await Product.find()
    console.log(product)
    res.header("Access-Control-Allow-Headers")
    res.json(product)
}

const Store = require('../../models/store.model')
module.exports.store = async function (req, res) {
    var store = await Store.find({_id : req.params.id})
    console.log(store)
    res.json(store)
}

module.exports.editStore = async function(req, res){
    console.log(req.body)
    Store.findOneAndUpdate( {_id: req.params.id }, req.body, (err, doc)=> {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
    })
}

var _ = require('lodash')

module.exports.unpollute = (req, res, next) => 
{
    console.log('throw adminUpdate.validate')
  req.body = _.omit(req.body, '__proto__')
  next()
}
var PublicKey = require('../models/publicKey')
var logger = require('../logger')

module.exports = function(user, publicKey, ws) {
  var crud = require('./helpers/crud')(user, publicKey, ws, PublicKey)

  function authorize(error, success) {
    if (user.isAdmin) success()
    else error({msg: 'Denied'})
  }

  function index(params, callback) {
    crud.index(params, callback)
  }

  function get(publicKeyId, callback) {
    crud.get(publicKeyId, callback)
  }

  function create(userData, callback) {
    authorize(callback, function() {
      crud.create(userData, callback)
    })
  }

  function update(userData, callback) {
    authorize(callback, function() {
      crud.update(userData, callback)
    })
  }

  function del(publicKeyId, callback) {
    authorize(callback, function() {
      crud.del(publicKeyId, callback)
    })
  }

  return {
    index: index,
    get: get,
    create: create,
    update: update,
    del: del
  }
}

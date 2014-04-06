var PublicKey = require('../models/publicKey')
var logger = require('../logger')

module.exports = function(user, publicKey, ws) {
  var crud = require('./helpers/crud')(user, publicKey, ws, PublicKey)

  function index(params, callback) {
    crud.index(params, callback)
  }

  function get(publicKeyId, callback) {
    crud.get(publicKeyId, callback)
  }

  function put(userData, callback) {
    if (!user.isAdmin) {
      callback({msg: 'Denied'})
      return
    }

    crud.put(userData, callback)
  }

  function del(publicKeyId, callback) {
    if (!user.isAdmin) {
      callback({msg: 'Denied'})
      return
    }

    crud.del(publicKeyId, callback)
  }

  return {
    index: index,
    get: get,
    put: put,
    del: del
  }
}

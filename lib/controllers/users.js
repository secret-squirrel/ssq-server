var User = require('../models/user')
var logger = require('../logger')

module.exports = function(user, publicKey, ws) {
  var crud = require('./helpers/crud')(user, publicKey, ws, User)

  function index(params, callback) {
    crud.index(params, callback)
  }

  function get(userId, callback) {
    crud.get(userId, callback)
  }

  function put(userData, callback) {
    if (!user.isAdmin) {
      callback({msg: 'Denied'})
      return
    }

    crud.put(userData, callback)
  }

  function del(userId, callback) {
    if (!user.isAdmin) {
      callback({msg: 'Denied'})
      return
    }

    crud.del(userId, callback)
  }

  return {
    index: index,
    get: get,
    put: put,
    del: del
  }
}

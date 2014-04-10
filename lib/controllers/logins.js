var Login = require('../models/login')
var logger = require('../logger')

module.exports = function(user, publicKey, ws) {
  var crud = require('./helpers/crud')(user, publicKey, ws, Login)

  function authorize(error, success) {
    // TODO: error if user does not already have access
    success()
  }

  function index(params, callback) {
    crud.index(params, callback)
  }

  function get(loginId, callback) {
    crud.get(loginId, callback)
  }

  function create(userData, callback) {
    crud.create(userData, callback)
  }

  function update(userData, callback) {
    authorize(callback, function() {
      crud.update(userData, callback)
    })
  }

  function del(loginId, callback) {
    authorize(callback, function() {
      crud.del(loginId, callback)
    })
  }

  return {
    index: index,
    get: get,
    put: put,
    del: del
  }
}

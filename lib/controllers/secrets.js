var Secret = require('../models/secret')

module.exports = function(user, publicKey, ws) {
  var crud = require('./helpers/crud')(user, publicKey, ws, Secret)

  function authorize(error, success) {
    // TODO: error if user does not already have access
    success()
  }

  function index(params, callback) {
    crud.index(params, callback)
  }

  function get(secretId, callback) {
    crud.get(secretId, callback)
  }

  function create(secretData, callback) {
    crud.create(secretData, callback)
  }

  function update(secretData, callback) {
    authorize(callback, function() {
      crud.update(secretData, callback)
    })
  }

  function del(secretId, callback) {
    authorize(callback, function() {
      crud.del(secretId, callback)
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

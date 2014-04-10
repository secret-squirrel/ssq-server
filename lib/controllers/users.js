var User = require('../models/user')

module.exports = function(user, publicKey, ws) {
  var crud = require('./helpers/crud')(user, publicKey, ws, User)

  function authorize(error, success) {
    if (user.isAdmin) success()
    else error({msg: 'Denied'})
  }

  function index(params, callback) {
    crud.index(params, callback)
  }

  function get(userId, callback) {
    crud.get(userId, callback)
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

  function del(userId, callback) {
    authorize(callback, function() {
      crud.del(userId, callback)
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

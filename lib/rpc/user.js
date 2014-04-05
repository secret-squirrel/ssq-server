var User = require('../models/user')
var logger = require('../logger')

module.exports = function(user, publicKey, ws) {
  function index(searchQuery, callback) {
    callback(null, 'You searched for ' + searchQuery)
  }

  function get(userId, callback) {
  }

  function put(user, callback) {
    User.create(user).complete(callback)
  }

  function del(userId, callback) {
  }

  return {
    index: index,
    get: get,
    put: put,
    del: del
  }
}

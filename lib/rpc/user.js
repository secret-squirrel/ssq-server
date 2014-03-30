var User = require('../models/user')

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

module.exports = {
  index: index,
  get: get,
  put: put,
  del: del
}

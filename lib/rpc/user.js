var User = require('../models/user')
var logger = require('../logger')

function index(searchQuery, callback) {
  callback(null, 'You searched for ' + searchQuery)
}

function get(userId, callback) {
}

function put(user, callback) {
  logger.info(user, 'putting user')
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

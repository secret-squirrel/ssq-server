var User = require('../models/user')
var logger = require('../logger')

module.exports = function(user, publicKey, ws) {
  function index(searchQuery, callback) {
    User.findAll().success(function(users) {
      callback(null, users.map(function(user) {
        return user.dataValues
      }))
    }).error(function(err) {
      callback(err)
    })
  }

  function get(userId, callback) {
    User.find(userId).success(function(user) {
      if (user) {
        callback(null, user.dataValues)
      } else {
        callback('No such user')
      }
    })
  }

  function put(user, callback) {
    User.create(user).complete(callback)
  }

  function del(userId, callback) {
    User.find(userId).success(function(user) {
      if (user) {
        user.destroy().success(function() {
          callback()
        }).error(callback)
      } else {
        callback('No such user')
      }
    })
  }

  return {
    index: index,
    get: get,
    put: put,
    del: del
  }
}

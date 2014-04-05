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

  function put(userData, callback) {
    if (userData.id) {
      User.find(userData.id).success(function(user) {
        if (user) {
          user.updateAttributes(userData)
            .success(function(result) { callback(null, user.dataValues) })
            .error(callback)
        } else {
          callback('User not found')
        }
      }).error(callback)
    } else {
      User.create(userData)
        .success(function(result) { callback(null, result.dataValues) })
        .error(callback)
    }
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

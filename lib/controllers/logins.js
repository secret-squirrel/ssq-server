var db = require('../db')
var Login = require('../models/login')

module.exports = function(user, publicKey, ws) {
  var crud = require('./helpers/crud')(user, publicKey, ws, Login)

  function authorize(loginId, error, success) {
    db.query(
      [
        'SELECT TRUE',
        'FROM secrets',
        'WHERE secrets."relatedId"=:relatedId',
        'AND secrets."relatedType"=:relatedType',
        'AND secrets."publicKeyId"=:publicKeyId',
        'LIMIT 1'
      ].join(' '),
      null,
      { raw: true },
      { relatedId: loginId, relatedType: 'login', publicKeyId: publicKey.id }
    ).success(function(result) {
      if (result.length > 0) success()
      else error({msg: 'Denied'})
    }).error(error)
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
    authorize(userData.id, callback, function() {
      crud.update(userData, callback)
    })
  }

  function del(loginId, callback) {
    authorize(loginId, callback, function() {
      crud.del(loginId, callback)
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

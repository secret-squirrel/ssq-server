var db = require('../db')
var Secret = require('../models/secret')

module.exports = function(user, publicKey, ws) {
  var crud = require('./helpers/crud')(user, publicKey, ws, Secret)

  function authorize(secretId, error, success) {
    db.query(
      [
        'SELECT TRUE',
        'FROM secrets AS s1',
        'INNER JOIN secrets AS s2',
        'ON (s1."relatedType"=s2."relatedType" AND s1."relatedId"=s2."relatedId")',
        'WHERE s1.id=:secretId AND s2."publicKeyId"=:publicKeyId',
        'LIMIT 1'
      ].join(' '),
      null,
      { raw: true },
      { secretId: secretId, publicKeyId: publicKey.id }
    ).success(function(result) {
      if (result.length > 0) success()
      else error({msg: 'Denied'})
    }).error(error)
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
    authorize(secretData.id, callback, function() {
      crud.update(secretData, callback)
    })
  }

  function del(secretId, callback) {
    authorize(secretId, callback, function() {
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

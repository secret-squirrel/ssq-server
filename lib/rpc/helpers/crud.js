var logger = require('../../logger')

module.exports = function(user, publicKey, ws, Model) {
  function index(params, callback) {
    Model.findAll().success(function(models) {
      callback(null, models.map(function(model) {
        return model.dataValues
      }))
    }).error(callback)
  }

  function get(id, callback) {
    Model.find(id).success(function(model) {
      if (model) {
        callback(null, model.dataValues)
      } else {
        callback({msg: 'Not found'})
      }
    }).error(callback)
  }

  function put(modelData, callback) {
    if (modelData.id) {
      Model.find(modelData.id).success(function(model) {
        if (model) {
          model.updateAttributes(modelData)
            .success(function(result) { callback(null, result.dataValues) })
            .error(callback)
        } else {
          callback({msg: 'Not found'})
        }
      }).error(callback)
    } else {
      Model.create(modelData)
        .success(function(result) { callback(null, result.dataValues) })
        .error(callback)
    }
  }

  function del(id, callback) {
    Model.find(id).success(function(model) {
      if (model) {
        model.destroy().complete(callback)
      } else {
        callback({msg: 'Not found'})
      }
    }).error(callback)
  }

  return {
    index: index,
    get: get,
    put: put,
    del: del
  }
}

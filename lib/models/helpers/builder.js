var Sequelize = require('sequelize')
var validations = require('./validations')
var db = require('../../db')

function buildModel(name) {
  var obj = {}
  var model

  function property(columnName, columnType) {
    columnType = (typeof columnType === 'string') ? Sequelize[columnType] : columnType
    obj[columnName] = obj[columnName] || {}
    obj[columnName].type = columnType
  }

  function properties(obj) {
    Object.keys(obj).forEach(function(key) {
      property(key, obj[key])
    })
  }

  function validation(columnName, key, value) {
    if (key == 'isUnique') {
      value = function(value, next) {
        validations.isUnique.call(obj, model, columnName, value, next)
      }
    }

    obj[columnName].validate = obj[columnName].validate || {}
    obj[columnName].validate[key] = value
  }

  function relationship(type, relatedModel) {
    if (!model) {
      throw "Call define() before relationship()"
    }
    var relatedModel = (typeof(relatedModel) == 'string') ? require('../' + relatedModel) : relatedModel
    model[type](relatedModel)
  }

  function define() {
    model = db.define(name, obj)
    return model
  }

  return {
    property: property,
    properties: properties,
    relationship: relationship,
    validation: validation,
    define: define
  }
}

module.exports = {
  buildModel: buildModel
}

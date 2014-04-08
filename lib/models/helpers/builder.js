var Sequelize = require('sequelize')
var validations = require('./validations')
var db = require('../../db')

function buildModel(name) {
  var obj = {}
  var relationships = []
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
      value = function() {
        validations.isUnique.call(obj, model, columnName, value, next)
      }
    }

    obj[columnName].validate = obj[columnName].validate || {}
    obj[columnName].validate[key] = value
  }

  function relationship(type, relatedModel) {
    relationships.push({
      type: type,
      relatedModel: relatedModel
    })
  }

  function bindRelationships() {
    if (!model) {
      throw "Call define() before bindRelationships()"
    }

    relationships.forEach(function(rel) {
      var relatedModel = (typeof(rel.relatedModel) == 'string') ? require('../' + rel.relatedModel) : rel
      model[rel.type](relatedModel)
    })
  }

  function define() {
    model = db.define(name, obj)
    bindRelationships()
    return model
  }

  return {
    property: property,
    properties: properties,
    relationship: relationship,
    validation: validation,
    define: define,
    bindRelationships: bindRelationships
  }
}

module.exports = {
  buildModel: buildModel
}

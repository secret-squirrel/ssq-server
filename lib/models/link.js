var Sequelize = require('sequelize')
var db = require('../db')

var Link = db.define('link', {
  fromType: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  },
  fromId: {
    type: Sequelize.BIGINT,
    validate: {
      notEmpty: true
    }
  },
  toType: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  },
  toId: {
    type: Sequelize.BIGINT,
    validate: {
      notEmpty: true
    }
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  createdBy: Sequelize.STRING,
  updatedBy: Sequelize.STRING
}, {
  validate: {
    uniqueRelationship: function(next) {
      db.validations.isUnique.call(this,
        Link,
        ['fromType', 'fromId', 'toType', 'toId'],
        [this.fromType, this.fromId, this.toType, this.toId],
        next
      )
    }
  }
})

module.exports = Link

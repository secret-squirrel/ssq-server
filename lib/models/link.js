var Sequelize = require('sequelize')
var db = require('../db')
var validations = require('./helpers/validations')

var relationships = {
  'login': ['secret']
}

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
    allowedRelationship: function(next) {
      if (!relationships[this.fromType]) {
        next('Invalid fromType')
      } else if (relationships[this.fromType].indexOf(this.toType) == -1) {
        next('Invalid toType')
      } else {
        next()
      }
    },
    uniqueRelationship: function(next) {
      validations.isUnique.call(this,
        Link,
        ['fromType', 'fromId', 'toType', 'toId'],
        [this.fromType, this.fromId, this.toType, this.toId],
        next
      )
    }
  }
})

module.exports = Link

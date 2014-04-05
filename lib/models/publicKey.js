var Sequelize = require('sequelize')
var db = require('../db')

var PublicKey = db.define('publicKey', {
  publicKey: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: true,
      isUnique: function(value, next) {
        db.validations.isUnique.call(this, PublicKey, 'publicKey', value, next)
      }
    }
  },
  fingerprint: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
      isUnique: function(value, next) {
        db.validations.isUnique.call(this, PublicKey, 'fingerprint', value, next)
      }
    }
  },
  userId: {
    type: Sequelize.BIGINT,
    validate: {
      notEmpty: true
    }
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  createdBy: Sequelize.STRING,
  updatedBy: Sequelize.STRING
})

module.exports = PublicKey

PublicKey.belongsTo(require('./user'))
PublicKey.hasMany(require('./secret'))

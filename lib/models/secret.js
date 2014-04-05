var Sequelize = require('sequelize')
var db = require('../db')

var Secret = db.define('secret', {
  publicKeyId: {
    type: Sequelize.BIGINT,
    validate: {
      notEmpty: true
    }
  },
  cipherText: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: true
    }
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  createdBy: Sequelize.STRING,
  updatedBy: Sequelize.STRING
})

module.exports = Secret

Secret.belongsTo(require('./publicKey'))

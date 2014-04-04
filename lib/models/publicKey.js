var Sequelize = require('sequelize')
var db = require('../db')

var PublicKey = db.define('publicKey', {
  publicKey: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: true
    }
  },
  fingerprint: {
    type: Sequelize.STRING,
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

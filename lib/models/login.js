var Sequelize = require('sequelize')
var db = require('../db')

var Login = db.define('login', {
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  },
  url: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  },
  notes: Sequelize.TEXT,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  updatedBy: Sequelize.STRING,
  isWrong: Sequelize.BOOLEAN
})

module.exports = Login

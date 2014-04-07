var Sequelize = require('sequelize')
var db = require('../db')
var validations = require('./helpers/validations')

var User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
      isUnique: function(value, next) {
        validations.isUnique.call(this, User, 'email', value, next)
      }
    }
  },
  isAdmin: Sequelize.BOOLEAN,
  loginCount: Sequelize.INTEGER,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  lastLoginAt: Sequelize.DATE,
  createdBy: Sequelize.STRING,
  updatedBy: Sequelize.STRING
})

module.exports = User

User.hasMany(require('./publicKey'))

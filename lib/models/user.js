var Sequelize = require('sequelize')
var db = require('../db')

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
        db.validations.isUnique.call(this, User, 'email', value, next)
      }
    }
  },
  loginCount: Sequelize.INTEGER,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  lastLoginAt: Sequelize.DATE,
  createdBy: Sequelize.STRING,
  updatedBy: Sequelize.STRING
})

module.exports = User

User.hasMany(require('./publicKey'))

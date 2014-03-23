var Sequelize = require('sequelize')
var config = require('../config/config.json')[process.env.NODE_ENV || 'development']

module.exports = new Sequelize(config.database, config.username, config.password, {
  dialect: config.dialect,
  host: config.host,
  pool: { maxConnections: 50, maxIdleTime: 30},
  logging: function(logLine) { /* TODO: bunyan */ },
  maxConcurrentQueries: 100
})

module.exports.validations = require('./db/validations')

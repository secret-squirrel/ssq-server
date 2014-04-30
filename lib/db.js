var Sequelize = require('sequelize')
var path = require('path')
var config = require(path.join(__dirname, '../config/config.json'))[process.env.NODE_ENV || 'development']
var logger = require('./logger')

var options = {
  dialect: config.dialect,
  host: config.host,
  pool: {
    maxConnections: 50,
    maxIdleTime: 30
  },
  logging: function(logLine) {
    logger.info(logLine)
  },
  maxConcurrentQueries: 100
}

module.exports = new Sequelize(config.database, config.username, config.password, options)

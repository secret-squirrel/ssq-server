var jayson = require('jayson')
var logger = require('./logger')

var app = jayson.server({
  User: require('./rpc/user'),

  heartbeat: function(beat, callback) {
    logger.info({beat: beat}, 'Client heartbeat')
    callback(null)
  },

  ping: function(callback) {
    callback(null, 'pong')
  }
})

module.exports = app

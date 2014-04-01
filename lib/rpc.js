var jayson = require('jayson')

var app = jayson.server({
  User: require('./rpc/user'),

  heartbeat: function(beat, callback) {
    console.log('Client heartbeat:', beat)
    callback(null)
  },

  ping: function(callback) {
    callback(null, 'pong')
  }
})

module.exports = app

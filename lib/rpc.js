var jayson = require('jayson')
var logger = require('./logger')

function createServer(user, publicKey, ws) {
  return jayson.server({

    User: require('./controllers/user')(user, publicKey, ws),
    PublicKey: require('./controllers/publicKey')(user, publicKey, ws),

    heartbeat: function(beat, callback) {
      logger.info({beat: beat}, 'Client heartbeat')
      callback(null)
    },

    ping: function(callback) {
      callback(null, 'pong')
    }
  })
}

module.exports = createServer

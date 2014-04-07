var jayson = require('jayson')
var logger = require('./logger')

function createServer(user, publicKey, ws) {
  return jayson.server({

    User: require('./controllers/users')(user, publicKey, ws),
    PublicKey: require('./controllers/publicKeys')(user, publicKey, ws),

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

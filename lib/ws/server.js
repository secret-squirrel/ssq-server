var WebSocketServer = require('ws').Server
var logger = require('../logger')
var rpc = require('../rpc')
var authenticate = require('./authenticate')

var wss = new WebSocketServer({
  server: require('./https').app
})

wss.on('connection', function(ws) {
  logger.info('Websocket connection')

  authenticate(ws, function(err, user, publicKey) {
    if (err) {
      ws.close()
    }
    else {
      rpc.bind(user, publicKey, ws)
    }
  })

  ws.on('close', function() {
    ws.close()
  })
})

module.exports = wss

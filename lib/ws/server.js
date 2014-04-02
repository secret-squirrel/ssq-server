var WebSocketServer = require('ws').Server
var logger = require('../logger')
var wsRPC = require('./rpc')
var challengeResponse = require('./challenge-response')

var wss = new WebSocketServer({
  server: require('../https/server').app
})

wss.on('connection', function(ws) {
  logger.info('Websocket connection')

  challengeResponse.authenticate(ws, function(err) {
    if (err) {
      ws.close()
    }
    else {
      wsRPC.bind(ws)
    }
  })

  ws.on('close', function() {
    ws.close()
  })
})

module.exports = wss

var WebSocketServer = require('ws').Server
var logger = require('./logger')
var wsRPC = require('./ws-rpc')

var wss = new WebSocketServer({
  server: require('./https-server').app
})

wss.on('connection', function(ws) {
  logger.info('Websocket connection')
  wsRPC.bind(ws)
})

module.exports = wss

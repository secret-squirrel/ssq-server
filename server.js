var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080})

wss.on('connection', function(ws) {
  console.log('Connected.')

  ws.on('message', function(message) {
    console.log(message)
    if(message === 'PING!') {
      ws.send('PONG!')
    }
  })

  ws.on('close', function() {
    console.log('Disconnected.')
    ws.close()
  })
})

var fs = require('fs')
var https = require('https')
var WebSocketServer = require('ws').Server
var rpc = require('./rpc')

// Dummy request handler
function processRequest(req, res) {
  res.writeHead(200)
  res.end('fdhveery')
}

var app = https.createServer({
  key: fs.readFileSync('./dev-key.pem'),
  cert: fs.readFileSync('./dev-cert.pem')
}, processRequest).listen(8080)


var wss = new WebSocketServer({server: app})

wss.on('connection', function(ws) {
  console.log('Connected.')

  ws.on('message', function(message) {
    console.log('Received: ' + JSON.stringify(message))
    rpc(message)
  })

  ws.on('close', function() {
    console.log('Disconnected.')
    ws.close()
  })
})

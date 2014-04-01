var fs = require('fs')
var https = require('https')
var WebSocketServer = require('ws').Server
var rpc = require('./rpc')
var logger = require('./logger')

function dummyRequestHandler(req, res) {
  res.writeHead(200)
  res.end('fdhveery')
}

var app = https.createServer({
  key: fs.readFileSync('./dev-key.pem'),
  cert: fs.readFileSync('./dev-cert.pem')
}, dummyRequestHandler)

var wss = new WebSocketServer({server: app})

wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    var request = JSON.parse(message)
    rpc(request, function(err, result) {
      reply(err, result)
    })
  })

  ws.on('close', function() {
    ws.close()
  })

  function reply(err, result) {
    var msg = err ? err : result
    if(!msg.id) return;

    ws.send(JSON.stringify(msg), function(err) {
      if(err) {
        logger.error({msg: msg}, 'An error occurred while sending reply')
      }
    })
  }
})

function listen(port) {
  logger.info({port: port}, 'Server listening')
  app.listen(port)
}

module.exports = {
  listen: listen
}

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
    var msg
    if(err) {
      msg = err
    } else {
      msg = result
    }

    // notifications don't set an id.
    if(!msg.id) return; 

    ws.send(JSON.stringify(msg), function(err) {
      if(err) {
        console.log('An error occurred while sending reply: ' + JSON.stringify(msg))
      }
    })
  }
})

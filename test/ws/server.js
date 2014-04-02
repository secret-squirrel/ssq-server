var WebSocket = require('ws')
var httpsServer = require('../../lib/https/server')
var wsServer = require('../../lib/ws/server')

describe('ws/server', function() {
  var port = 9999;

  before(function() {
    httpsServer.listen(port)
  })

  it('accepts secure socket connections', function(done) {
    var uri = 'wss://localhost:' + port + '/'
    var ws = new WebSocket(uri, {rejectUnauthorized:false})
    ws.on('open', function() {
      done()
    })
  })
})

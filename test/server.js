var WebSocket = require('ws')
var server = require('../lib/server')

describe('server', function() {
  var port = 9999;

  before(function() {
    server.listen(9999)
  })

  it('accepts secure socket connections', function(done) {
    var uri = 'wss://localhost:' + port + '/'
    var ws = new WebSocket(uri, {rejectUnauthorized:false})
    ws.on('open', function() {
      done()
    })
  })
})

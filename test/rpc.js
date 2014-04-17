var WebSocket = require('ws')
var testServer = require('./fixtures/server')
var mockUser = {}
var mockPublicKey = {}
var rpc = require('../lib/rpc')
var jsonrpc = require('../lib/jsonrpc')

describe('rpc', function() {
  var port = 16000
  var wss, wsc

  beforeEach(function() {
    port += 1
    wss = testServer.listen(port)
    wss.on('connection', function(ws) {
      rpc.bind(mockUser, mockPublicKey, ws)
    })

    var uri = 'wss://localhost:' + port
    wsc = new WebSocket(uri, { rejectUnauthorized: false })
  })

  afterEach(function() {
    wss.close()
    wsc.close()
  })

  it('dispatches notifications', function(done) {
    wsc.on('open', function(err) {
      var hello = jsonrpc.notify('hello')
      wsc.send(JSON.stringify(hello), function(err) {
        if(err) assert.fail(err, undefined, 'Failed to send notification')
        done()
      })
    })
  })

  it('returns responses from method calls', function(done) {
    wsc.on('open', function(err) {
      var ping = jsonrpc.request('ping')
      wsc.send(JSON.stringify(ping))
      wsc.on('message', function(str) {
        var response = JSON.parse(str)
        assert.equal(response.id, ping.id, 'Response id should match request id')
        assert.equal(response.result, 'pong', 'Unexpected result in response')
        done()
      })
    })
  })
})

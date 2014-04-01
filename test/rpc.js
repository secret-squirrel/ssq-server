var rpc = require('../lib/rpc')
var client = require('jayson').client(rpc)

describe('rpc', function() {

  it('dispatches notifications', function(done) {
    client.request('heartbeat', ['test!'], null, function(err, msg) {
      done()
    })
  })

  it('returns responses from method calls', function(done) {
    client.request('ping', [], function(err, msg) {
      assert.equal(msg.result, 'pong')
      done()
    })
  })
})

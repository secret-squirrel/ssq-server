var uuid = require('node-uuid')
var jsonrpc = require('../lib/jsonrpc')

describe('jsonrpc', function() {
  describe('requests', function() {
    it('builds JSON-RPC 2.0 requests', function() {
      var request = jsonrpc.request('hello', 'world')
      assert.equal(request.method, 'hello', 'Request method did not match')
      assert.equal(request.params, 'world', 'params did not match')
      assert.equal(request.jsonrpc, '2.0', 'Expected version 2.0')
      assert.isDefined(request.id, 'Requests should define an id')
    })

    it('builds JSON-RPC 2.0 notifications', function() {
      var request = jsonrpc.notify('hello', 'world')
      assert.equal(request.method, 'hello', 'Request method did not match')
      assert.equal(request.params, 'world', 'params did not match')
      assert.equal(request.jsonrpc, '2.0', 'Expected version 2.0')
      assert.isUndefined(request.id, 'Notifications should not define an id')
    })
  })

  describe('responses', function() {
    it('builds JSON-RPC 2.0 responses', function() {
      var request = jsonrpc.request('hello', 'world')
      var response = jsonrpc.response(null, request, 'result')
      assert.equal(response.id, request.id, 'Response id did not match Request id')
      assert.equal(response.jsonrpc, '2.0', 'Expected version 2.0')
      assert.equal(response.result, 'result', 'Result was not set')
    })
    it('builds JSON-RPC 2.0 error responses', function() {
      var request = jsonrpc.request('hello', 'world')
      var response = jsonrpc.response('Invalid request', request, 'result')
      assert.equal(response.error, 'Invalid request', 'Error did not match')
      assert.isUndefined(response.result, 'Error responses should not define a result')
    })
  })
})


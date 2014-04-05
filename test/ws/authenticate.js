var fs = require('fs')
var path = require('path')
var WebSocket = require('ws')
var ursa = require('ursa')
var httpsServer = require('../../lib/https/server')
var wsServer = require('../../lib/ws/server')
var PublicKey = require('../../lib/models/publicKey')

var port = 9999;
var algorithm = 'sha256'

function connect() {
  return new WebSocket('wss://localhost:' + port, {rejectUnauthorized:false})
}

function sendChallengeResponse(ws, request, params) {
  ws.send(JSON.stringify({
    jsonrpc: request.jsonrpc,
    id: request.id,
    method: 'response',
    params: params
  }))
}

function loadPem(name) {
  return fs.readFileSync(path.join(__dirname, '../fixtures/data/' + name))
}

describe('ws/authenticate', function() {
  before(function() {
    httpsServer.listen(port)
  })

  before(function(done) {
    require('../fixtures').load(done)
  })

  var privateKey, fingerprint, unauthorizedPrivateKey
  before(function(done) {
    privateKey = ursa.createPrivateKey(loadPem('example.pem'), 'foobar', 'utf8')
    unauthorizedPrivateKey = ursa.createPrivateKey(loadPem('unauthorized.pem'), 'foobar', 'utf8')
    fingerprint = privateKey.toPublicSshFingerprint('base64')
    done()
  })

  after(function() {
    httpsServer.close()
  })

  it('completes a successful handshake', function(done) {
    var ws = connect()
    ws.on('message', function(str) {
      var request = JSON.parse(str)

      switch(request.method) {
        case 'challenge':
          sendChallengeResponse(ws, request, {
            algorithm: algorithm,
            fingerprint: fingerprint,
            signature: privateKey.hashAndSign(algorithm, request.params.message, 'base64', 'base64')
          })
          break
        case 'success':
          done()
          break
        default:
          assert.notOk('unexpected message')
          break
      }
    })
  })

  it('rejects unknown fingerprints', function(done) {
    var ws = connect()
    ws.on('message', function(str) {
      var request = JSON.parse(str)

      switch(request.method) {
        case 'challenge':
          sendChallengeResponse(ws, request, {
            algorithm: algorithm,
            fingerprint: fingerprint.replace(/./g, 'a'),
            signature: privateKey.hashAndSign(algorithm, request.params.message, 'base64', 'base64')
          })
          break
        case 'success':
          assert.notOk('should have failed')
          break
        case 'error':
          assert.equal(request.params.msg, 'Unknown user')
          done()
          break
        default:
          assert.notOk('unexpected message')
          break
      }
    })
  })

  it('rejects invalid signatures', function(done) {
    var ws = connect()
    ws.on('message', function(str) {
      var request = JSON.parse(str)

      switch(request.method) {
        case 'challenge':
          sendChallengeResponse(ws, request, {
            algorithm: algorithm,
            fingerprint: fingerprint,
            signature: privateKey.hashAndSign(algorithm, request.params.message, 'base64', 'base64').replace(/./g, 'a')
          })
          break
        case 'success':
          assert.notOk('should have failed')
          break
        case 'error':
          assert.equal(request.params.msg, 'error:04091077:rsa routines:INT_RSA_VERIFY:wrong signature length')
          done()
          break
        default:
          assert.notOk('unexpected message')
          break
      }
    })
  })

  it('rejects signatures that do not match', function(done) {
    var ws = connect()
    ws.on('message', function(str) {
      var request = JSON.parse(str)

      switch(request.method) {
        case 'challenge':
          sendChallengeResponse(ws, request, {
            algorithm: algorithm,
            fingerprint: fingerprint,
            signature: unauthorizedPrivateKey.hashAndSign(algorithm, request.params.message, 'base64', 'base64')
          })
          break
        case 'success':
          assert.notOk('should have failed')
          break
        case 'error':
          assert.equal(request.params.msg, 'error:0407006A:rsa routines:RSA_padding_check_PKCS1_type_1:block type is not 01')
          done()
          break
        default:
          assert.notOk('unexpected message')
          break
      }
    })
  })

  it('rejects unknown fingerprints', function(done) {
    var ws = connect()
    ws.on('message', function(str) {
      var request = JSON.parse(str)

      switch(request.method) {
        case 'challenge':
          sendChallengeResponse(ws, request, {
            algorithm: algorithm,
            fingerprint: unauthorizedPrivateKey.toPublicSshFingerprint('base64'),
            signature: unauthorizedPrivateKey.hashAndSign(algorithm, request.params.message, 'base64', 'base64')
          })
          break
        case 'success':
          assert.notOk('should have failed')
          break
        case 'error':
          assert.equal(request.params.msg, 'Unknown user')
          done()
          break
        default:
          assert.notOk('unexpected message')
          break
      }
    })
  })
})

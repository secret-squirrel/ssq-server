var fs = require('fs')
var path = require('path')
var WebSocket = require('ws')
var openpgp = require('openpgp')
var httpsServer = require('../../lib/ws/https')
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

function loadKey(name) {
  var armoredText = fs.readFileSync(path.join(__dirname, '../fixtures/data/' + name)).toString()
  return openpgp.key.readArmored(armoredText).keys[0]
}

describe('ws/authenticate', function() {
  before(function() {
    httpsServer.listen(port)
  })

  var privateKey, publicKey, fingerprint, unauthorizedPrivateKey
  before(function(done) {
    privateKey = loadKey('private-key.asc')
    assert(privateKey.decrypt('s00pers3krit'), 'Could not decrypt private key')

    publicKey = loadKey('public-key.asc')
    fingerprint = publicKey.primaryKey.fingerprint
    unauthorizedPrivateKey = loadKey('unauthorized-private-key.asc')
    unauthorizedPrivateKey.decrypt('s00pers3krit')

    done()
  })

  beforeEach(function(done) {
    assert.isFulfilled(db.query('TRUNCATE "publicKeys"')).notify(done)
  })

  beforeEach(function(done) {
    require('../fixtures/publicKeys')(done)
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
            signature: openpgp.signClearMessage([privateKey], request.params.message)
          })
          break
        case 'success':
          done()
          break
        default:
          assert.notOk('unexpected message: ' + JSON.stringify(request))
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
            signature: openpgp.signClearMessage(privateKey, request.params.message)
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
          assert.notOk('unexpected message: ' + JSON.stringify(request))
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
            signature: openpgp.signClearMessage(privateKey, request.params.message).replace(/./g, 'a')
          })
          break
        case 'success':
          assert.notOk('should have failed')
          break
        case 'error':
          assert.include(request.params.msg, 'ASCII armor type')
          done()
          break
        default:
          assert.notOk('unexpected message: ' + JSON.stringify(request))
          break
      }
    })
  })

  it('rejects signatures that do not match the public key', function(done) {
    var ws = connect()
    ws.on('message', function(str) {
      var request = JSON.parse(str)

      switch(request.method) {
        case 'challenge':
          sendChallengeResponse(ws, request, {
            algorithm: algorithm,
            fingerprint: fingerprint,
            signature: openpgp.signClearMessage(unauthorizedPrivateKey, request.params.message)
          })
          break
        case 'success':
          assert.notOk('should have failed')
          break
        case 'error':
          assert.equal(request.params.msg, 'Authentication failed')
          done()
          break
        default:
          assert.notOk('unexpected message: ' + JSON.stringify(request))
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
            fingerprint: unauthorizedPrivateKey.primaryKey.fingerprint,
            signature: openpgp.signClearMessage(unauthorizedPrivateKey, request.params.message)
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
          assert.notOk('unexpected message: ' + JSON.stringify(request))
          break
      }
    })
  })
})

var uuid = require('node-uuid')
var ursa = require('ursa')
var jayson = require('jayson')
var logger = require('../logger')
var request = require('../controllers/helpers/request')
var User = require('../models/user')
var PublicKey = require('../models/publicKey')

function sendChallenge(challenge, ws, callback) {
  var req = request('challenge', { message: challenge })
  ws.send(JSON.stringify(req), function(err, result) {
    if(err) {
      logger.error('Unable to send challenge: ' + err)
      callback(err)
      ws.close()
    }
  })
}

function verifyUser(challenge, response, publicKeyRecord, ws, callback) {
  var publicKey = ursa.createPublicKey(publicKeyRecord.publicKey, 'base64')

  try {
    if(publicKey.hashAndVerify(response.params.algorithm, challenge, response.params.signature, 'base64')) {
      var user = User.find(publicKeyRecord.userId).success(function(user) {
        ws.send(JSON.stringify(request('success')))
        callback(null, user, publicKey)
      })
    } else {
      var msg = 'Authentication failed for key with fingerprint: ' + fingerprint
      logger.warn(msg)
      ws.send(JSON.stringify(request('error', {msg: msg})))
      ws.close()
      callback(msg)
    }
  } catch (ex) {
    ws.send(JSON.stringify(request('error', {msg: ex.message})))
  }
}

function handleResponse(challenge, response, ws, callback) {
  var fingerprint = response.params.fingerprint

  PublicKey.find({ where: {fingerprint: fingerprint} }).success(function(publicKeyRecord) {
    if (publicKeyRecord == null) {
      ws.send(JSON.stringify(request('error', {msg: 'Unknown user'}, null)))
      ws.close()
    }
    else {
      verifyUser(challenge, response, publicKeyRecord, ws, callback)
    }
  }).error(function(err) {
    console.log('error looking up user')
  })
}

module.exports = function(ws, callback) {
  var challenge = uuid.v4()

  sendChallenge(challenge, ws, callback)

  ws.on('message', function(str) {
    var response = JSON.parse(str)

    switch(response.method) {
      case 'response':
        handleResponse(challenge, response, ws, callback)
        break

      default:
        console.log('default')
        break
    }
  })
}

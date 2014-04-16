var uuid = require('node-uuid')
var notify = require('../jsonrpc').notify
var request = require('../jsonrpc').request
var jayson = require('jayson')
var openpgp = require('openpgp')
var logger = require('../logger')
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
  try {
    var publicKey = openpgp.key.readArmored(publicKeyRecord.publicKey).keys[0]
    var cleartextMesssage = openpgp.cleartext.readArmored(response.params.signature)

    var signatures = openpgp.verifyClearSignedMessage([publicKey], cleartextMesssage).signatures
    if (signatures.length == 1) {
      var user = User.find(publicKeyRecord.userId).success(function(user) {
        ws.send(JSON.stringify(notify('success', { user: user })))
        callback(null, user, publicKey)
      })
    } else {
      var msg = 'Authentication failed'
      logger.warn(msg)
      ws.send(JSON.stringify(notify('error', {msg: msg})))
      ws.close()
      callback(msg)
    }
  } catch (ex) {
    ws.send(JSON.stringify(notify('error', {msg: ex.message})))
  }
}

function handleResponse(challenge, response, ws, callback) {
  var fingerprint = response.params.fingerprint

  PublicKey.find({ where: {fingerprint: fingerprint} }).success(function(publicKeyRecord) {
    if (publicKeyRecord == null) {
      ws.send(JSON.stringify(notify('error', {msg: 'Unknown user'})))
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

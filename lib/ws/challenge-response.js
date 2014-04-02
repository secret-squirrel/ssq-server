var ursa = require('ursa')
var jaysonClient = new require('jayson').jaysonClient
var logger = require('../logger')

function loadUser(publicKey, callback) {
  callback('Not implemented')
}

function handleIdentification(ws, message, callback) {
  if (message.method == 'handshake.identify') {
    try {
      ws.pubKey = ursa.coercePublicKey(message.params[0])
    } catch (ex) {
      callback('First argument was not a PEM-formatted public key: ' + ex.message)
    }

    var encrypted = ws.pubKey.encrypt(randomData)
    ws.challenge = jaysonClient.message('handshake.challenge', [encrypted.toString('hex')])
    ws.send(ws.challenge, callback)
  } else {
    callback('Expected handshake.identify, got: ' + message.method)
  }
}

function handleChallengeResponse(ws, message, callback) {
  if (ws.challenge != null && message.id == challenge.id) {
    if (randomData.toString('base64') == message.response) {
      loadUser(publicKey, function(err, user) {
        if (err) {
          callback('Could not match stored public key in the database: ' + message.response)
        } else if (user) {
          logger.info(user, 'User authenticated')
          ws.user = user
          callback(null)
        }
      })
    } else {
      callback('Client decrypted data did not match')
    }
  }
  else {
    callback('Expected a response to message id ' + challenge.id + ', got: ' + str)
  }
}

function authenticate(ws, callback) {
  var messageCount = 0

  ws.on('message', function(str) {
    messageCount = messageCount + 1

    var message = JSON.parse(str)

    logger.info(message, 'Challenge-response message')

    switch(messageCount) {
      case 1:
        handleIdentification(ws, message, function(err) {
          if (err) {
            ws.removeAllListeners('message')
            callback(err)
          }
        })
        break
      case 2:
        handleChallengeResponse(ws, message, function(err) {
          ws.removeAllListeners('message')
          callback(err)
        })
        break
    }
  })
}

module.exports = {
  authenticate: authenticate
}

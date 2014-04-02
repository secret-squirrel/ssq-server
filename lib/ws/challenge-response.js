var ursa = require('ursa')
var jaysonClient = new require('jayson').jaysonClient
var logger = require('../logger')

function loadUser(publicKey, callback) {
  callback('Not implemented')
}

function authenticate(ws, callback) {
  var publicKey = null
  var randomData = null
  var messageCount = 0
  var failedWithError = null
  var challenge = null

  function bailOut(err) {
    failedWithError = err
    logger.error(err)
    callback(err)
    ws.close()
  }

  try {
    randomData = crypto.randomBytes(64)
  } catch (ex) {
    bailOut('Could not generate random bytes for authentication: ' + ex.message)
  }

  ws.on('message', function(str) {
    var message = JSON.parse(str)

    logger.info(message, 'Challenge-response message')

    if (messageCount == 1) {
      if (message.method == 'handshake.identify') {
        try {
          pubKey = ursa.coercePublicKey(message.params[0])
        } catch (ex) {
          bailOut('First argument was not a PEM-formatted public key: ' + ex.message)
        }

        var encrypted = pubKey.encrypt(randomData)
        challenge = jaysonClient.message('handshake.challenge', [encrypted.toString('hex')])
        ws.send(challenge)
      } else {
        bailOut('Expected handshake.identify, got: ' + message.method)
      }
    }

    else if (messageCount == 2) {
      if (challenge != null && message.id == challenge.id) {
        if (randomData.toString('base64') == message.response) {
          loadUser(publicKey, function(err, user) {
            if (err) {
              bailOut('Could not match stored public key in the database: ' + message.response)
            } else if (user) {
              logger.info(user, 'User authenticated')
              ws.user = user
              callback(null)
            }
          })
        } else {
          bailOut('Client decrypted data did not match')
        }
      }
      else {
        bailOut('Expected a response to message id ' + challenge.id + ', got: ' + str)
      }
    }
  })
}

module.exports = {
  authenticate: authenticate
}

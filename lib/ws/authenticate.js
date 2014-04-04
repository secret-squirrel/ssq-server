var uuid = require('node-uuid')
var ursa = require('ursa')
var jayson = require('jayson')
var logger = require('../logger')
var request = require('../rpc/request')

module.exports = function(ws, callback) {
  var challenge = uuid.v4()

  ws.send(request('challenge', { message: challenge }, function(err, result) {
    if(err) {
      logger.error('Unable to send challenge: ' + err)
      callback(err)
      ws.close()
    }
  })

  ws.on('message', function(str) {
    var response = JSON.parse(str)
    switch(response.method) {
      case 'response':
        var fingerprint = response.params.fingerprint
        var publicKeyRecord = PublicKey.findByFingerPrint(fingerprint)
        var publicKey = ursa.coercePublicKey(publicKeyRecord.publicKey)
        if(publicKey.hashAndVerify(response.algorithm, challenge, response.signature, 'base64') {
          var user = User.find(publicKeyRecord.userId)
          callback(null, { user: user, publicKey: publicKey })
        } else {
          var msg = 'Authentication failed for key with fingerprint: ' + fingerprint
          logger.warn(msg)
          ws.send(request('error', msg))
          ws.close()

          callback(msg)
        }
        break

      default:
        break
    }
  })
}

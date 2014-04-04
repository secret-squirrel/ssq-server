var fs = require('fs')
var path = require('path')
var ursa = require('ursa')
var User = require('../../lib/models/user')
var PublicKey = require('../../lib/models/publicKey')

 var sequelize_fixtures = require('sequelize-fixtures'),
      models = {
          PublicKey: PublicKey
      }

function load(callback) {
  var user = User.find({ where: { name: 'Alice' }})

  var publicKey = ursa.coercePublicKey(fs.readFileSync(path.join(__dirname, 'data/example.pub')))
  var fingerprint = publicKey.toPublicSshFingerprint('base64')

  var fixtures = [{
      'model': 'PublicKey',
      'data': {
        'userId': user.id,
        'publicKey': publicKey.toPublicPem('base64'),
        'fingerprint': fingerprint
      }
    }
  ]

  sequelize_fixtures.loadFixtures(fixtures, models, function(err) {
    if(err) {
      console.log('Failed to load Public Key fixtures: ' + JSON.stringify(err))
    } else {
      if(callback) callback()
    }
  })
}

module.exports = load

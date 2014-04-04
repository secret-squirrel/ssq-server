var fs = require('fs')
var path = require('path')
var ursa = require('ursa')
 var sequelize_fixtures = require('sequelize-fixtures'),
      models = {
          PublicKey: require('../../lib/models/publicKey')
      }

var publicKey = ursa.coercePublicKey(fs.readFileSync(path.join(__dirname, 'data/example.pub')))
var fingerprint = publicKey.toPublicSshFingerprint('base64')

var fixtures = [{
    'model': 'PublicKey',
    'data': {
      'userId': 1,
      'publicKey': publicKey.toPublicPem('base64'),
      'fingerprint': fingerprint
    }
  }
]

sequelize_fixtures.loadFixtures(fixtures, models, function(err) {
  if(err) {
    console.log('Failed to load Public Key fixtures: ' + JSON.stringify(err))
  }
})

var fs = require('fs')
var path = require('path')
var ursa = require('ursa')
var User = require('../../lib/models/user')
var PublicKey = require('../../lib/models/publicKey')

var loadFixtures = require('sequelize-fixtures').loadFixtures

function load(callback) {
  User.find({ where: { name: 'Alice' }}).success(function(user) {
    var publicKey = ursa.coercePublicKey(fs.readFileSync(path.join(__dirname, 'data/example.pub')))
    var fingerprint = publicKey.toPublicSshFingerprint('base64')
    var fixtures = [
      {
        model: 'PublicKey',
        data: {
          userId: user.id,
          publicKey: publicKey.toPublicPem('base64'),
          fingerprint: fingerprint
        }
      }
    ]

    loadFixtures(fixtures, { PublicKey: PublicKey }, callback)
  })
}

module.exports = load

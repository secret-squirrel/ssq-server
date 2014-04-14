var fs = require('fs')
var path = require('path')
var openpgp = require('openpgp')
var User = require('../../lib/models/user')
var PublicKey = require('../../lib/models/publicKey')

var loadFixtures = require('sequelize-fixtures').loadFixtures

function load(callback) {
  User.find({ where: { name: 'Alice' }}).success(function(user) {
    var armoredText = fs.readFileSync(path.join(__dirname, 'data/public-key.asc')).toString()
    var publicKey = openpgp.key.readArmored(armoredText).keys[0]

    var fixtures = [
      {
        model: 'PublicKey',
        data: {
          userId: user.id,
          publicKey: armoredText,
          fingerprint: publicKey.primaryKey.fingerprint
        }
      }
    ]

    loadFixtures(fixtures, { PublicKey: PublicKey }, callback)
  })
}

module.exports = load

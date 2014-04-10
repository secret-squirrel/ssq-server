var fs = require('fs')
var path = require('path')
var ursa = require('ursa')
var Login = require('../../lib/models/login')
var Secret = require('../../lib/models/secret')

var loadFixtures = require('sequelize-fixtures').loadFixtures

function load(callback) {
  Login.find({ where: { name: 'Sample login' }}).success(function(login) {
    var fixtures = [
      {
        model: 'Secret',
        data: {
          relatedType: 'login',
          relatedId: login.id,
          publicKeyId: 123,
          cipherText: 'dummy cipher text'
        }
      },
      {
        model: 'Secret',
        data: {
          relatedType: 'login',
          relatedId: 111,
          publicKeyId: 456,
          cipherText: 'dummy cipher text'
        }
      }
    ]

    loadFixtures(fixtures, { Secret: Secret }, callback)
  })
}

module.exports = load

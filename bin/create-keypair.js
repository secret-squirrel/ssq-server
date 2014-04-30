#!/usr/bin/env node

var Q = require('Q')
var openpgp = require('openpgp')
var prompt = require('prompt')
var fs = require('fs')
var path = require('path')
var User = require('../lib/models/user')
var PublicKey = require('../lib/models/publicKey')
prompt.message = prompt.delimiter = ''

var promptGet = Q.nfbind(prompt.get)
var writeFile = Q.nfbind(fs.writeFile)

var getKey = function() {
  return getKeyParams()
          .then(function(result) {
            return createKey(result.passPhrase, result.bits)
          })
}

var getUser = function() { 
  return getUserParams()
          .then(function(email) {
            return User.find({ where: { email: email } })
          })
          .then(function(result) {
            return result.dataValues
          })
}

getKey()
  .then(function(key) {
    return getUser()
    .then(function(user) {
      return associateWithUser(user, key)
    })
    .then(function() {
      var filename = 'privatekey_' + key.primaryKey.fingerprint + '.asc'
      var filepath = path.join(process.env['HOME'], filename)
      return writeFile(filepath, key.armor())
      .then(function() {
        console.log('\n\n********************************************************\n')
        console.log('Your private key has been saved to:\n')
        console.log(filepath)
      })
    })
    .then(function() {
      console.log('\n********************************************************\n')
      console.log('This is your public key:\n')
      console.log(key.toPublic().armor())
      console.log('\n********************************************************\n')
      console.log('This is your key fingerprint:\n')
      console.log(key.toPublic().primaryKey.fingerprint)
    })
  })
  .catch(function(error) {
    console.log('Error:')
    console.log(error)
  })
  .done(function() {
    process.exit()
  })

function getKeyParams() {
  var schema = {
    properties: {
      bits: {
        minimum: 1024,
        maximum: 4096,
        default: 2048,
        allowEmpty: false,
        message: 'Keysize must be an integer between 1024 and 4096',
        description: 'Enter a keysize: '
      },
      passPhrase: {
        hidden: true,
        allowEmpty: false,
        minLength: 8,
        maxLength: 64,
        message: 'Passphrase must be between 8 and 64 characters long',
        description: 'Enter a passphrase: '
      }
    }
  }

  return promptGet(schema).then(function(result) {
    var bits = parseInt(result.bits)
    var passPhrase = result.passPhrase
    return { passPhrase: passPhrase, bits: bits }
  })
}

function createKey(passPhrase, bits) {
  if(!bits) bits = 2048
  return openpgp.key.generate(1, bits, '', passPhrase)
}

function getUserParams() {
  var schema = {
    properties: {
      email: {
        allowEmpty: false,
        description: 'Enter the email an existing user: '
      }
    }
  }
  return promptGet(schema).then(function(result) {
    return result.email
  })
}

function associateWithUser(user, key) {
  console.log('Associating user with key.')
  return PublicKey.create({
    userId: user.id,
    fingerprint: key.toPublic().primaryKey.fingerprint,
    publicKey: key.toPublic().armor()
  })
  .then(function(result) {
    return result.dataValue
  })
}

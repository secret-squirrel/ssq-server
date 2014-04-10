var mockUser = {}
var mockPublicKey = {}
var mockWs = {}
var Secret = require('../../lib/models/secret')
var controller = require('../../lib/controllers/secrets')(mockUser, mockPublicKey, mockWs)

describe('controllers/secrets', function() {
  beforeEach(function(done) {
    assert.isFulfilled(db.query('TRUNCATE "logins"')).notify(done)
  })

  beforeEach(function(done) {
    assert.isFulfilled(db.query('TRUNCATE "secrets"')).notify(done)
  })

  beforeEach(function(done) {
    require('../fixtures/logins')(done)
  })

  beforeEach(function(done) {
    require('../fixtures/secrets')(done)
  })

  var allSecrets
  beforeEach(function(done) {
    Secret.findAll().success(function(secrets) {
      allSecrets = secrets
      done()
    })
  })

  describe('index', function() {
    it('returns all secrets', function(done) {
      controller.index({}, function(err, results) {
        assert.notOk(err)
        assert.ok(results)
        assert.equal(allSecrets.length, results.length)
        done()
      })
    })
  })

  describe('get', function() {
    it('returns a single secret', function(done) {
      var expectedSecret = allSecrets[0]
      controller.get(expectedSecret.id, function(err, result) {
        assert.notOk(err)
        assert.ok(result)
        assert.equal(expectedSecret.id, result.id)
        assert.equal(expectedSecret.name, result.name)
        done()
      })
    })

    it('returns an error for missing secrets', function(done) {
      controller.get(999, function(err, result) {
        assert.ok(err)
        assert.notOk(result)
        assert.include(err.msg, 'Not found')
        done()
      })
    })
  })

  describe('create', function() {
    it('creates a new secret', function(done) {
      var secretData = {
        publicKeyId: 123,
        relatedType: 'login',
        relatedId: 456,
        cipherText: 'abc123'
      }
      controller.create(secretData, function(err, result) {
        assert.notOk(err)
        assert.equal(secretData.name, result.name)
        assert.equal(secretData.email, result.email)
        assert.isNumber(result.id)
        done()
      })
    })

    it('rejects invalid secret objects', function(done) {
      controller.create({}, function(err, result) {
        assert.ok(err)
        assert.notOk(result)
        assert.property(err, 'publicKeyId')
        assert.property(err, 'cipherText')
        assert.property(err, 'relatedType')
        assert.property(err, 'relatedId')
        done()
      })
    })
  })

  describe('update', function() {
    it('alters an existing secret', function(done) {
      var secretData = allSecrets[0].dataValues
      secretData.name = 'Updated name'
      controller.update(secretData, function(err, result) {
        assert.notOk(err)
        assert.equal(secretData.fingerprint, result.fingerprint)
        assert.equal(secretData.id, result.id)
        Secret.find(secretData.id).success(function(secret) {
          assert.ok(secret)
          assert.equal(secretData.fingerprint, secret.fingerprint)
          done()
        })
      })
    })

    it('rejects objects without an id property', function(done) {
      controller.update({}, function(err, result) {
        assert.ok(err)
        assert.notOk(result)
        assert.include(err.msg, 'ID')
        done()
      })
    })

    it('fails to update non-existant secrets', function(done) {
      controller.update({id: 999}, function(err, result) {
        assert.ok(err)
        assert.notOk(result)
        assert.include(err.msg, 'Not found')
        done()
      })
    })
  })

  describe('del', function() {
    it('deletes an existing secret', function(done) {
      var expectedSecret = allSecrets[0]
      controller.del(expectedSecret.id, function(err) {
        assert.notOk(err)
        Secret.find(expectedSecret.id).success(function(secret) {
          assert.notOk(secret)
          done()
        })
      })
    })

    it('returns an error for an unknown secretId', function(done) {
      controller.del(999, function(err) {
        assert.ok(err)
        assert.include(err.msg, 'Not found')
        done()
      })
    })
  })
})

var mockUser = {
  isAdmin: true
}
var mockPublicKey = {}
var mockWs = {}
var PublicKey = require('../../lib/models/publicKey')
var controller = require('../../lib/controllers/publicKeys')(mockUser, mockPublicKey, mockWs)

describe('controllers/publicKeys', function() {
  beforeEach(function(done) {
    assert.isFulfilled(db.query('TRUNCATE "users"')).notify(done)
  })

  beforeEach(function(done) {
    assert.isFulfilled(db.query('TRUNCATE "publicKeys"')).notify(done)
  })

  beforeEach(function(done) {
    require('../fixtures/users')(done)
  })

  beforeEach(function(done) {
    require('../fixtures/publicKeys')(done)
  })

  var allPublicKeys
  beforeEach(function(done) {
    PublicKey.findAll().success(function(publicKeys) {
      allPublicKeys = publicKeys
      done()
    })
  })

  describe('index', function() {
    it('returns all publicKeys', function(done) {
      controller.index({}, function(err, results) {
        assert.notOk(err)
        assert.ok(results)
        assert.equal(allPublicKeys.length, results.length)
        done()
      })
    })
  })

  describe('get', function() {
    it('returns a single publicKey', function(done) {
      var expectedPublicKey = allPublicKeys[0]
      controller.get(expectedPublicKey.id, function(err, result) {
        assert.notOk(err)
        assert.ok(result)
        assert.equal(expectedPublicKey.id, result.id)
        assert.equal(expectedPublicKey.name, result.name)
        done()
      })
    })

    it('returns an error for missing publicKeys', function(done) {
      controller.get(999, function(err, result) {
        assert.ok(err)
        assert.notOk(result)
        assert.include(err.msg, 'Not found')
        done()
      })
    })
  })

  describe('create', function() {
    it('creates a new publicKey', function(done) {
      var publicKeyData = {
        publicKey: 'test key',
        fingerprint: 'test fingerprint',
        userId: 1
      }
      controller.create(publicKeyData, function(err, result) {
        assert.notOk(err)
        assert.equal(publicKeyData.name, result.name)
        assert.equal(publicKeyData.email, result.email)
        assert.isNumber(result.id)
        done()
      })
    })

    it('rejects invalid publicKey objects', function(done) {
      controller.create({}, function(err, result) {
        assert.ok(err)
        assert.notOk(result)
        assert.property(err, 'publicKey')
        assert.property(err, 'fingerprint')
        done()
      })
    })
  })

  describe('update', function() {
    it('alters an existing publicKey', function(done) {
      var publicKeyData = allPublicKeys[0].dataValues
      publicKeyData.fingerprint = 'Updated fingerprint'
      controller.update(publicKeyData, function(err, result) {
        assert.notOk(err)
        assert.equal(publicKeyData.fingerprint, result.fingerprint)
        assert.equal(publicKeyData.id, result.id)
        PublicKey.find(publicKeyData.id).success(function(publicKey) {
          assert.ok(publicKey)
          assert.equal(publicKeyData.fingerprint, publicKey.fingerprint)
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

    it('fails to update non-existant publicKeys', function(done) {
      controller.update({id: 999}, function(err, result) {
        assert.ok(err)
        assert.notOk(result)
        assert.include(err.msg, 'Not found')
        done()
      })
    })
  })

  describe('del', function() {
    it('deletes an existing publicKey', function(done) {
      var expectedPublicKey = allPublicKeys[0]
      controller.del(expectedPublicKey.id, function(err) {
        assert.notOk(err)
        PublicKey.find(expectedPublicKey.id).success(function(publicKey) {
          assert.notOk(publicKey)
          done()
        })
      })
    })

    it('returns an error for an unknown publicKeyId', function(done) {
      controller.del(999, function(err) {
        assert.ok(err)
        assert.include(err.msg, 'Not found')
        done()
      })
    })
  })

  describe('access control', function() {
    before(function() {
      mockUser.isAdmin = false
    })

    after(function() {
      mockUser.isAdmin = true
    })

    it('restricts regular users from the create method', function(done) {
      controller.create({}, function(err) {
        assert.ok(err)
        assert.include(err.msg, 'Denied')
        done()
      })
    })

    it('restricts regular users from the update method', function(done) {
      controller.update({}, function(err) {
        assert.ok(err)
        assert.include(err.msg, 'Denied')
        done()
      })
    })

    it('restricts regular users from the del method', function(done) {
      controller.del(999, function(err) {
        assert.ok(err)
        assert.include(err.msg, 'Denied')
        done()
      })
    })
  })
})

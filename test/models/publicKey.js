var PublicKey = require('../../lib/models/publicKey')

describe('models/publicKey', function() {
  function publicKeyFactory() {
    return {
      publicKey: 'test key',
      fingerprint: 'test fingerprint',
      userId: 1
    }
  }

  beforeEach(function(done) {
    assert.isFulfilled(db.query('TRUNCATE "publicKeys"')).notify(done)
  })

  it('can create a new record', function(done) {
    assert.isFulfilled(PublicKey.create(publicKeyFactory())).notify(done)
  })

  describe('validation', function() {
    it('requires the presence of basic fields', function(done) {
      PublicKey.create().fail(function(err) {
        assert.property(err, 'publicKey')
        assert.property(err, 'fingerprint')
        done()
      })
    })

    it('forces uniqueness of fingerprint and publicKey fields', function(done) {
      assert.isFulfilled(PublicKey.create(publicKeyFactory()))
        .then(function() {
          return assert.isRejected(PublicKey.create(publicKeyFactory()))
        }).done(function(err) {
          assert.property(err, 'fingerprint')
          assert.include(err.fingerprint[0], 'not unique')
          assert.property(err, 'publicKey')
          assert.include(err.publicKey[0], 'not unique')
          done()
        })
    })
  })
})

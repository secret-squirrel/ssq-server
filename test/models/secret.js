var PublicKey = require('../../lib/models/publicKey')
var Secret = require('../../lib/models/secret')

describe('models/secret', function() {

  var publicKey
  before(function(done) {
    PublicKey.findAll({limit: 1}).success(function(publicKeys) {
      assert(publicKeys.length > 0)
      publicKey = publicKeys[0]
      done()
    })
  })

  function secretFactory() {
    return {
      publicKeyId: publicKey.id,
      cipherText: 'dummy ciphertext',
      relatedType: 'login',
      relatedId: 123
    }
  }

  beforeEach(function(done) {
    assert.isFulfilled(db.query('TRUNCATE "secrets"')).notify(done)
  })

  it('can create a new record', function(done) {
    assert.isFulfilled(Secret.create(secretFactory())).notify(done)
  })

  describe('validation', function() {
    it('requires the presence of basic fields', function(done) {
      Secret.create().fail(function(err) {
        assert.property(err, 'publicKeyId')
        assert.property(err, 'cipherText')
        assert.property(err, 'relatedType')
        assert.property(err, 'relatedId')
        done()
      })
    })

    it('requires relatedType be of a known type', function(done) {
      var data = {
        publicKeyId: publicKey.id,
        cipherText: 'dummy ciphertext',
        relatedType: 'whatever',
        relatedId: 123
      }
      Secret.create().fail(function(err) {
        assert.property(err, 'relatedType')
        done()
      })
    })
  })
})

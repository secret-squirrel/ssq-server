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
      cipherText: 'dummy ciphertext'
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
        done()
      })
    })
  })
})

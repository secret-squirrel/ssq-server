var User = require('../../lib/models/user')

describe('User', function() {
  function userFactory() {
    return {
      name: 'Alice',
      email: 'alice@example.com'
    }
  }

  beforeEach(function(done) {
    assert.isFulfilled(db.query('TRUNCATE users')).notify(done)
  })

  it('can create a new record', function(done) {
    assert.isFulfilled(User.create(userFactory())).notify(done)
  })

  describe('validation', function() {
    it('requires the presence of basic fields', function(done) {
      User.create().fail(function(err) {
        assert.property(err, 'name')
        assert.property(err, 'email')
        done()
      })
    })

    it('forces email uniqueness', function(done) {
      assert.isFulfilled(User.create(userFactory()))
        .then(function() {
          return assert.isRejected(User.create(userFactory()))
        }).done(function(err) {
          assert.property(err, 'email')
          assert.include(err.email[0], 'not unique')
          done()
        })
    })
  })
})

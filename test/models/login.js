var Login = require('../../lib/models/login')

describe('models/login', function() {
  function loginFactory() {
    return {
      name: 'Test login',
      url: 'http://www.example.com'
    }
  }

  beforeEach(function(done) {
    assert.isFulfilled(db.query('TRUNCATE logins')).notify(done)
  })

  it('can create a new record', function(done) {
    assert.isFulfilled(Login.create(loginFactory())).notify(done)
  })

  describe('validation', function() {
    it('requires the presence of basic fields', function(done) {
      Login.create().fail(function(err) {
        assert.property(err, 'url')
        assert.property(err, 'name')
        done()
      })
    })
  })
})

var mockUser = {}
var mockPublicKey = {
  id: 123
}
var mockWs = {}
var Login = require('../../lib/models/login')
var controller = require('../../lib/controllers/logins')(mockUser, mockPublicKey, mockWs)

describe('controllers/logins', function() {
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

  var allLogins
  beforeEach(function(done) {
    Login.findAll().success(function(logins) {
      allLogins = logins
      done()
    })
  })

  describe('index', function() {
    it('returns all logins', function(done) {
      controller.index({}, function(err, results) {
        assert.notOk(err)
        assert.ok(results)
        assert.equal(allLogins.length, results.length)
        done()
      })
    })
  })

  describe('get', function() {
    it('returns a single login', function(done) {
      var expectedLogin = allLogins[0]
      controller.get(expectedLogin.id, function(err, result) {
        assert.notOk(err)
        assert.ok(result)
        assert.equal(expectedLogin.id, result.id)
        assert.equal(expectedLogin.name, result.name)
        done()
      })
    })

    it('returns an error for missing logins', function(done) {
      controller.get(999, function(err, result) {
        assert.ok(err)
        assert.notOk(result)
        assert.include(err.msg, 'Not found')
        done()
      })
    })
  })

  describe('create', function() {
    it('creates a new login', function(done) {
      var loginData = {
        name: 'test login',
        url: 'http://example.com'
      }
      controller.create(loginData, function(err, result) {
        assert.notOk(err)
        assert.equal(loginData.name, result.name)
        assert.equal(loginData.email, result.email)
        assert.isNumber(result.id)
        done()
      })
    })

    it('rejects invalid login objects', function(done) {
      controller.create({}, function(err, result) {
        assert.ok(err)
        assert.notOk(result)
        assert.property(err, 'name')
        assert.property(err, 'url')
        done()
      })
    })
  })

  describe('update', function() {
    it('alters an existing login', function(done) {
      var loginData = allLogins[0].dataValues
      loginData.name = 'Updated name'
      controller.update(loginData, function(err, result) {
        assert.notOk(err)
        assert.equal(loginData.fingerprint, result.fingerprint)
        assert.equal(loginData.id, result.id)
        Login.find(loginData.id).success(function(login) {
          assert.ok(login)
          assert.equal(loginData.fingerprint, login.fingerprint)
          done()
        })
      })
    })
  })

  describe('del', function() {
    it('deletes an existing login', function(done) {
      var expectedLogin = allLogins[0]
      controller.del(expectedLogin.id, function(err) {
        assert.notOk(err)
        Login.find(expectedLogin.id).success(function(login) {
          assert.notOk(login)
          done()
        })
      })
    })
  })

  describe('authorization', function() {
    it('will not update objects without an id property', function(done) {
      controller.update({}, function(err, result) {
        assert.ok(err)
        assert.notOk(result)
        assert.include(err.msg, 'Denied')
        done()
      })
    })

    it('fails to update unknown loginIds', function(done) {
      controller.update({id: 999}, function(err, result) {
        assert.ok(err)
        assert.notOk(result)
        assert.include(err.msg, 'Denied')
        done()
      })
    })

    it('will not del an unknown loginId', function(done) {
      controller.del(999, function(err) {
        assert.ok(err)
        assert.include(err.msg, 'Denied')
        done()
      })
    })

    describe('modifying logins we do not have access to', function() {
      var unauthorizedLogin
      before(function() {
        unauthorizedLogin = allLogins.filter(function(l) {
          return l.name == 'Unauthorized login'
        })[0]
      })

      it('refuses to update', function(done) {
        controller.update({id: unauthorizedLogin.id}, function(err, result) {
          assert.ok(err)
          assert.notOk(result)
          assert.include(err.msg, 'Denied')
          done()
        })
      })

      it('refuses to delete', function(done) {
        controller.del(unauthorizedLogin.id, function(err, result) {
          assert.ok(err)
          assert.notOk(result)
          assert.include(err.msg, 'Denied')
          done()
        })
      })
    })
  })
})

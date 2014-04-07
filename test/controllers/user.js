var mockUser = {
  isAdmin: true
}
var mockPublicKey = {}
var mockWs = {}
var User = require('../../lib/models/user')
var rpcUser = require('../../lib/controllers/user')(mockUser, mockPublicKey, mockWs)

describe('controllers/user', function() {
  beforeEach(function(done) {
    assert.isFulfilled(db.query('TRUNCATE users')).notify(done)
  })

  beforeEach(function(done) {
    require('../fixtures/users')(done)
  })

  var allUsers
  beforeEach(function(done) {
    User.findAll().success(function(users) {
      allUsers = users
      done()
    })
  })

  describe('index', function() {
    it('returns all users', function(done) {
      rpcUser.index({}, function(err, results) {
        assert.notOk(err)
        assert.ok(results)
        assert.equal(allUsers.length, results.length)
        done()
      })
    })
  })

  describe('get', function() {
    it('returns a single user', function(done) {
      var expectedUser = allUsers[0]
      rpcUser.get(expectedUser.id, function(err, result) {
        assert.notOk(err)
        assert.ok(result)
        assert.equal(expectedUser.id, result.id)
        assert.equal(expectedUser.name, result.name)
        done()
      })
    })

    it('returns an error for missing users', function(done) {
      rpcUser.get(999, function(err, result) {
        assert.ok(err)
        assert.notOk(result)
        assert.include(err.msg, 'Not found')
        done()
      })
    })
  })

  describe('put', function() {
    it('creates a new user', function(done) {
      var userData = {
        name: 'Test user',
        email: 'test@example.com'
      }
      rpcUser.put(userData, function(err, result) {
        assert.notOk(err)
        assert.equal(userData.name, result.name)
        assert.equal(userData.email, result.email)
        assert.isNumber(result.id)
        done()
      })
    })

    it('updates an existing user', function(done) {
      var userData = allUsers[0].dataValues
      userData.name = 'Updated Name'
      rpcUser.put(userData, function(err, result) {
        assert.notOk(err)
        assert.equal(userData.name, result.name)
        assert.equal(userData.id, result.id)
        User.find(userData.id).success(function(user) {
          assert.ok(user)
          assert.equal(userData.name, user.name)
          done()
        })
      })
    })

    it('rejects invalid user objects', function(done) {
      rpcUser.put({}, function(err, result) {
        assert.ok(err)
        assert.notOk(result)
        assert.property(err, 'name')
        assert.property(err, 'email')
        done()
      })
    })

    it('fails to update non-existant users', function(done) {
      rpcUser.put({id: 999}, function(err, result) {
        assert.ok(err)
        assert.notOk(result)
        assert.include(err.msg, 'Not found')
        done()
      })
    })
  })

  describe('del', function() {
    it('deletes an existing user', function(done) {
      var expectedUser = allUsers[0]
      rpcUser.del(expectedUser.id, function(err) {
        assert.notOk(err)
        User.find(expectedUser.id).success(function(user) {
          assert.notOk(user)
          done()
        })
      })
    })

    it('returns an error for an unknown userId', function(done) {
      rpcUser.del(999, function(err) {
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

    it('restricts regular users from the put method', function(done) {
      rpcUser.put({}, function(err) {
        assert.ok(err)
        assert.include(err.msg, 'Denied')
        done()
      })
    })

    it('restricts regular users from the del method', function(done) {
      rpcUser.del(999, function(err) {
        assert.ok(err)
        assert.include(err.msg, 'Denied')
        done()
      })
    })
  })
})

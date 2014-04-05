var mockUser = {}
var mockPublicKey = {}
var mockWs = {}
var User = require('../../lib/models/user')
var rpcUser = require('../../lib/rpc/user')(mockUser, mockPublicKey, mockWs)

describe('rpc/user', function() {
  beforeEach(function(done) {
    assert.isFulfilled(db.query('TRUNCATE "users"')).notify(done)
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
        assert.include(err, 'No such user')
        done()
      })
    })
  })

  describe('put', function() {
    it('creates a new user', function(done) {
      assert.notOk('todo')
    })

    it('updates an existing user', function(done) {
      assert.notOk('todo')
    })

    it('rejects invalid user objects', function(done) {
      assert.notOk('todo')
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
        assert.include(err, 'No such user')
        done()
      })
    })
  })

})

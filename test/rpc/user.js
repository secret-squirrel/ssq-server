var mockUser = {}
var mockPublicKey = {}
var mockWs = {}
var User = require('../../lib/models/user')
var rpcUser = require('../../lib/rpc/user')(mockUser, mockPublicKey, mockWs)

describe('rpc/user', function() {

  var allUserCount
  before(function(done) {
    User.count().success(function(c) {
      allUserCount = c
      done()
    })
  })

  it('returns all users', function(done) {
    rpcUser.index({}, function(err, results) {
      assert.ok(results)
      assert.equal(allUserCount, results.length)
      done()
    })
  })
})

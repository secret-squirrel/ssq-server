var db = require('../lib/db')

describe('db', function() {
  it('connects to the database', function(done) {
    assert.isFulfilled(db.authenticate()).notify(done)
  })
})

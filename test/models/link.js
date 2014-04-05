var Link = require('../../lib/models/link')

describe('models/link', function() {
  function linkFactory() {
    return {
      fromType: 'login',
      fromId: 123,
      toType: 'secret',
      toId: 456
    }
  }

  beforeEach(function(done) {
    assert.isFulfilled(db.query('TRUNCATE "links"')).notify(done)
  })

  it('can create a new record', function(done) {
    assert.isFulfilled(Link.create(linkFactory())).notify(done)
  })

  describe('validation', function() {
    it('requires the presence of basic fields', function(done) {
      Link.create().fail(function(err) {
        assert.property(err, 'fromType')
        assert.property(err, 'fromId')
        assert.property(err, 'toType')
        assert.property(err, 'toId')
        done()
      })
    })

    it('forces uniqueness of relationships', function(done) {
      assert.isFulfilled(Link.create(linkFactory()))
        .then(function() {
          return assert.isRejected(Link.create(linkFactory()))
        }).done(function(err) {
          assert.property(err, 'uniqueRelationship')
          assert.include(err.uniqueRelationship[0], 'not unique')
          done()
        })
    })

  })
})

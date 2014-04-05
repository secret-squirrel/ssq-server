module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addIndex('links',
      ['fromType', 'fromId', 'toType', 'toId'],
      { indicesType: 'UNIQUE' }
    )
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.removeIndex('links',
      ['fromType', 'fromId', 'toType', 'toId']
    )
    done()
  }
}

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('secrets', 'relatedType', {
      type: DataTypes.STRING,
      allowNull: false
    })
    migration.addColumn('secrets', 'relatedId', {
      type: DataTypes.STRING,
      allowNull: false
    })

    migration.addIndex('secrets', ['relatedType', 'relatedId'])

    done()
  },
  down: function(migration, DataTypes, done) {
    migration.removeIndex('secrets', ['relatedType', 'relatedId'])
    migration.removeColumn('secrets', 'relatedType')
    migration.removeColumn('secrets', 'relatedId')
    done()
  }
}

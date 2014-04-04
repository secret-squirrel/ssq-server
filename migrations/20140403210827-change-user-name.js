module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('users', 'name', {
      type: DataTypes.STRING,
      allowNull: false
    })
    migration.removeColumn('users', 'firstName')
    migration.removeColumn('users', 'lastName')
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('users', 'name')
    migration.addColumn('users', 'firstName', DataTypes.STRING)
    migration.addColumn('users', 'lastName', DataTypes.STRING)
    done()
  }
}

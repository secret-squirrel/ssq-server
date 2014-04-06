module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('users', 'isAdmin', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('users', 'isAdmin')
    done()
  }
}

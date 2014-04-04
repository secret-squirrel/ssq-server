module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('userPublicKeys', 'fingerprint', {
      type: DataTypes.STRING,
      allowNull: false
    })
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('userPublicKeys', 'fingerprint')
    done()
  }
}

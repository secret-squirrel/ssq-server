module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('userPublicKeys', 'fingerprint', {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    })
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('userPublicKeys', 'fingerprint')
    done()
  }
}

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.renameTable('loginCredentials', 'secrets')
    migration.renameTable('loginCredentials_id_seq', 'secrets_id_seq')
    migration.removeColumn('secrets', 'loginId')
    migration.removeColumn('secrets', 'username')
    migration.removeColumn('secrets', 'password')
    migration.addColumn('secrets', 'cipherText', {
      type: DataTypes.TEXT,
      allowNull: false
    })
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.renameTable('secrets', 'loginCredentials')
    migration.renameTable('secrets_id_seq', 'loginCredentials_id_seq')
    migration.addColumn('loginCredentials', 'loginId', {
      type: DataTypes.INTEGER,
      allowNull: false
    })
    migration.addColumn('loginCredentials', 'username', { type: DataTypes.TEXT })
    migration.addColumn('loginCredentials', 'password', { type: DataTypes.TEXT })
    migration.removeColumn('loginCredentials', 'cipherText')
    done()
  }
}

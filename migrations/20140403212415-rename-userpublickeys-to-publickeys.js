module.exports = {
  up: function(migration, DataTypes, done) {
    migration.renameTable('userPublicKeys', 'publicKeys')
    migration.renameTable('userPublicKeys_id_seq', 'publicKeys_id_seq')
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.renameTable('publicKeys', 'userPublicKeys')
    migration.renameTable('publicKeys_id_seq', 'userPublicKeys_id_seq')
    done()
  }
}

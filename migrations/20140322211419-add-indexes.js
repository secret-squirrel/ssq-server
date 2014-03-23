module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addIndex('favorites', ['userId'])
    migration.addIndex('loginCredentials', ['loginId', 'userPublicKeyId'])
    migration.addIndex('taggings', ['loginId'])
    migration.addIndex('taggings', ['tagId'])
    migration.addIndex('userPublicKeys', ['userId'])
    migration.addIndex('userPublicKeys', ['publicKey'])
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.removeIndex('favorites', ['userId'])
    migration.removeIndex('loginCredentials', ['loginId', 'userPublicKeyId'])
    migration.removeIndex('taggings', ['loginId'])
    migration.removeIndex('taggings', ['tagId'])
    migration.removeIndex('userPublicKeys', ['userId'])
    migration.removeIndex('userPublicKeys', ['publicKey'])
    done()
  }
}

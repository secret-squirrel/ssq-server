module.exports = {
  up: function(migration, DataTypes, done) {
    migration.dropTable('loginCredentials')
    migration.createTable('secrets', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      publicKeyId: { type: DataTypes.INTEGER, allowNull: false },
      cipherText: { type: DataTypes.TEXT, allowNull: false },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
      createdBy: { type: DataTypes.STRING },
      updatedBy: { type: DataTypes.STRING }
    })
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('secrets')
    migration.createTable('loginCredentials', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      loginId: { type: DataTypes.INTEGER, allowNull: false },
      userPublicKeyId: { type: DataTypes.INTEGER, allowNull: false },
      username: { type: DataTypes.TEXT },
      password: { type: DataTypes.TEXT },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
      createdBy: { type: DataTypes.STRING },
      updatedBy: { type: DataTypes.STRING }
    })
    done()
  }
}

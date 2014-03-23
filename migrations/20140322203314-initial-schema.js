module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('favorites', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      loginId: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE }
    })

    migration.createTable('logins', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.TEXT },
      url: { type: DataTypes.TEXT },
      notes: { type: DataTypes.TEXT },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
      updatedBy: { type: DataTypes.STRING },
      isWrong: { type: DataTypes.BOOLEAN }
    })

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

    migration.createTable('taggings', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      loginId: { type: DataTypes.INTEGER, allowNull: false },
      tagId: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE }
    })

    migration.createTable('tags', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false }
    })

    migration.createTable('users', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      firstName: { type: DataTypes.STRING },
      lastName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      loginCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
      lastLoginAt: { type: DataTypes.DATE },
      createdBy: { type: DataTypes.STRING },
      updatedBy: { type: DataTypes.STRING }
    })

    migration.createTable('userPublicKeys', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      publicKey: { type: DataTypes.TEXT, allowNull: false },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
      createdBy: { type: DataTypes.STRING },
      updatedBy: { type: DataTypes.STRING }
    })

    done()
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('favorites')
    migration.dropTable('logins')
    migration.dropTable('taggings')
    migration.dropTable('tags')
    migration.dropTable('users')
    migration.dropTable('userPublicKeys')
    done()
  }
}

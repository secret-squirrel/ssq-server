module.exports = {
  up: function(migration, DataTypes, done) {
    migration.dropTable('favorites')
    migration.dropTable('taggings')
    migration.dropTable('tags')
    done()
  },
  down: function(migration, DataTypes, done) {
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

    migration.createTable('favorites', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      loginId: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE }
    })
    done()
  }
}

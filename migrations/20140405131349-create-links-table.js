module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('links', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      fromType: { type: DataTypes.STRING, allowNull: false },
      fromId: { type: DataTypes.BIGINT, allowNull: false },
      toType: { type: DataTypes.STRING, allowNull: false },
      toId: { type: DataTypes.BIGINT, allowNull: false },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
      createdBy: { type: DataTypes.STRING },
      updatedBy: { type: DataTypes.STRING }
    })
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('links')
    done()
  }
}

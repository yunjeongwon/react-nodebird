const { Model, DataTypes } = require('sequelize');

class Hashtag extends Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'Hashtag',
      tableName: 'hashtags',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
  }
}

module.exports = Hashtag;

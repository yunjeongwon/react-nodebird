const { Model, DataTypes } = require('sequelize');

class Image extends Model {
  static init(sequelize) {
    return super.init({
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'Image',
      tableName: 'images',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Image.belongsTo(db.Post);
  }
}

module.exports = Image;

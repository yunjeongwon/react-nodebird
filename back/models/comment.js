const { Model, DataTypes } = require('sequelize');

class Comment extends Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'Comment',
      tableName: 'comments',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
  
    });
  }

  static associate(db) {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  }
}

module.exports = Comment;

const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize){
    return super.init({
      email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked'  });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      foreignKey: 'FollwingId',
      as: 'Followers',
    });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      foreignKey: 'FollwerId',
      as: 'Followings',
    });
  }
}

module.exports = User;

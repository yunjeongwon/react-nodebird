const { Sequelize } = require('sequelize');

const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');
const Hashtag = require('./hashtag');
const Image = require('./image');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};
db.User = User;
db.Post = Post;
db.Comment = Comment;
db.Hashtag = Hashtag;
db.Image = Image;

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;

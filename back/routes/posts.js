const express = require('express');
const { Op } = require('sequelize');

const { Post, User, Image, Comment } = require('../models');

const router = express();

router.get('/', async (req, res, next) => { // GET /posts?lastId=1
  try {
    const where = {};
    if (parseInt(req.query.lastId)) { // 초기 로딩이 아닌, 스크롤 내렸을 때
      where.id = { [Op.lt]: parseInt(req.query.lastId) }
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        },],
      },],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/related', async (req, res, next) => { // GET /posts/related
  try {
    const followings = await User.findAll({
      attributes: ['id'],
      include: [{
        model: User,
        as: "Followers",
        where: { id: req.user.id },
      }]
    });

    const where = {
      UserId: { [Op.in]: followings.map((v) => v.id) }
    };
    if (parseInt(req.query.lastId)) { // 초기 로딩이 아닌, 스크롤 내렸을 때
      where.id = { [Op.lt]: parseInt(req.query.lastId) }
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        },],
      },],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/unrelated', async (req, res, next) => { // GET /posts/unrelated
  try {
    const followings = await User.findAll({
      attributes: ['id'],
      include: [{
        model: User,
        as: "Followers",
        where: { id: req.user.id },
      }]
    });

    const where = {
      UserId: { [Op.notIn]: followings.map((v) => v.id).concat(req.user.id) }
    };
    if (parseInt(req.query.lastId)) { // 초기 로딩이 아닌, 스크롤 내렸을 때
      where.id = { [Op.lt]: parseInt(req.query.lastId) }
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        },],
      },],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
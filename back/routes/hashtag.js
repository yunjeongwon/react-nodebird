const express = require('express');
const { Op } = require('sequelize');

const { Post, User, Image, Comment, Hashtag } = require('../models');

const router = express();

router.get('/:tag', async (req, res, next) => { // GET /hashtag/헤시태그이름?lastId=1
  try {
    const hashtag = await Hashtag.findOne({
      where: { name: decodeURIComponent(req.params.tag) }
    });
    if (!hashtag) {
      return res.status(403).send('해시태그를 찾을 수 없습니다.');
    }

    const where = {};
    if (parseInt(req.query.lastId)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId) }
    }
    const posts = await hashtag.getPosts({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC']
      ],
      include: [{
        model: User,
        attributes: ['id', 'nickname']
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id']
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname']
        }]
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname']
        }, {
          model: Image
        }]
      }]
    })
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
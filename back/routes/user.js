const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const { User, Post, Image, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {// GET /user
  try {
    if (req.user) {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password'],
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }],
      });
      res.status(200).json(user);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/',isNotLoggedIn, async (req, res, next) => {// POST /user
  try {
    const exUser = await User.findOne({ where: { email: req.body.email } });
    if (exUser) {
      return res.status(403).send('already existed email');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {// POST /user/login
  passport.authenticate('local', (err, user, info) => {// req, res, next 쓰려고 미들웨어 확장했다
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    if (!user) {
      return res.status(403).redirect('/user/login');
    }
  
    req.logIn(user, async (loginErr) => {// res.setHeader('Cookie', secret문자열); 포함
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ['password'],
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }]
      });

      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post('/logout', isLoggedIn, (req, res) => {// POST /user/logout
  req.logout();
  req.session.destroy();
  res.send('ok');
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => { //PATCH /user/nickname
  try {
    await User.update({
      nickname: req.body.nickname,
    }, {
      where: { id: req.user.id },
    });
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => { // PATCH /user/1/follow
  try {
    const user = await User.findOne({ where: { id: parseInt(req.params.userId) }});
    if (!user) {
      return res.status(403).send('존재하지 않는 사람을 팔로우 하시려구요?');
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => { // DELETE /user/1/follow
  try {
    const user = await User.findOne({ where: { id: parseInt(req.params.userId) }});
    if (!user) {
      return res.status(403).send('존재하지 않는 사람을 언팔로우 하시려구요?');
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => { // DELETE /user/follower/1
  try {
    const user = await User.findOne({ where: { id: parseInt(req.params.userId) }});
    if (!user) {
      return res.status(403).send('없는 사람을 팔로워 차단하시려구요?');
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/followers', isLoggedIn, async (req, res, next) => { // GET /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id }});
    if (!user) {
      return res.status(403).send('없는 사람입니다.');
    }

    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit),
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/followings', isLoggedIn, async (req, res, next) => { // GET /user/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id }});
    if (!user) {
      return res.status(403).send('없는 사람입니다.');
    }
    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit),
    });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:userId/posts', async (req, res, next) => { // GET /user/1/posts?lastId=9
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.userId) },
    });
    if (!user) {
      return res.status(403).send('없는 유저입니다.');
    }

    const where = {};
    if (parseInt(req.query.lastId)) {
      where.id = {
        [Op.lt]: parseInt(req.query.lastId)
      }
    }

    const posts = await user.getPosts({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC']
      ],
      include: [{
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname']
        }]
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id']
      }, {
        model: User,
        attributes: ['id', 'nickname']
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
    });
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:userId', async (req, res, next) => { // GET /user/1 ----- 와일드카드는 제일 아래로 내려버리자, 파람스에 걸려서 다른 라우터에 접근 안될 수도 있기 때문
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: parseInt(req.params.userId) },
      attributes: {
        exclude: ['password']
      },
      include: [{
        model: Post,
      }, {
        model: User,
        as: 'Followings',
        attributes: ['id']
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id']
      }]
    });

    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON(); // 시퀄라이즈에서 보내준 데이터는 json이 아니다, json으로 바꿔서 가공하자
      data.Posts = data.Posts.length;
      data.Followings = data.Followings.length;
      data.Followers = data.Followers.length;
      res.status(200).json(data);
    } else {
      res.status(403).send('존재하지 않는 사용자입니다.');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;

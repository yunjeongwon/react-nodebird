const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');

const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const hashtagRouter = require('./routes/hashtag');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();
const app = express();

db.sequelize.sync().then(() => {
  console.log("db 연결 성공");
}).catch(console.error);
passportConfig(passport);


if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  app.use(morgan('combined'));
  app.use(hpp());
  app.use(helmet());
  app.use(cors({
    origin: 'https://nodebirdjw.shop',
    credentials: true,
  })); 
} else {
  app.use(morgan('dev'));
  app.use(cors({
    origin: true,
    credentials: true,
  })); 
}

app.use('/', express.static(path.join(__dirname, 'uploads'))); // http://localhost:3065/
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  proxy: true,
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: true,
    domain: process.env.NODE_ENV === 'production' &&'.nodebirdjw.shop',
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/hashtag', hashtagRouter);

app.get('/', (req, res) => {
  return res.send('server is successfully connected');
});

app.listen(3065, () => {
  return console.log('서버 실행 중..');
});

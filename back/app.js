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
  app.use(morgan('combined'));
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(morgan('dev'));
}

app.use(cors({
  origin: ['http://localhost:3060', 'nodebird.com'], // true면 요청하는 주소에서 cors 방지, // Access-Control-Allow-Origin
  credentials: true,// 쿠키 전달: true, // Access-Control-Allow-Credential
})); 
app.use('/', express.static(path.join(__dirname, 'uploads'))); // http://localhost:3065/
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/hashtag', hashtagRouter);

// app.use((req, res, next) => {
//   const error = new Error();
//   error.status = 404;
//   next(error);
// });

// app.use((err, req, res, next) => {
//   res.send(err);
// });

app.listen(3065, () => {
  console.log('서버 실행 중..');
});

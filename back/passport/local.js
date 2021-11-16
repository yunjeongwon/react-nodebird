const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {// 비동기는 서버에러가 발생할 수 있다 try-catch로 에러 처리해주자
      try {
        const user = await User.findOne({ where: { email }});
        if (!user) {
          return done(null, false, { reason: 'Incorrect email.',  }); // done(서버에러 있는지, 성공했는지, 클라이언트에러) 이것은 passport.authenticate 콜백 함수이다.
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
          return done(null, false, { reason: 'Incorrect password.' });
        }
        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }
  ))
};

const local = require('./local');
const { User } = require('../models');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id }});
      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error);
    }
  });

  local(passport);
};

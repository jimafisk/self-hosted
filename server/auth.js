// Authentication
const passport = require('passport')
const Strategy = require('passport-local').Strategy;
const {find} = require('lodash')

const {getData,saveData} = require('./mongo')

passport.use(new Strategy(
  async (username, password, done) =>{
    const user = await getUser(username)
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' })
    } else if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    } else {
      return done(null, user)
    }
  }
));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.username);
});

passport.deserializeUser(async (username, cb) => {
  const user = await getUser(username)
  cb(null, user)
});


const bcrypt = require('bcrypt');

async function hashPassword(pw) {
  return await bcrypt.hash(pw, 10)
}

async function checkPassword(pw, hash) {
  return await bcrypt.compare(pw, hash)
}

async function createUser({ email, password }) {
  const hash = await hashPassword(password)
  await saveData('users', { email, hash })
}

async function getUser(username) {
  const users = await getData('users')
  return find(users, ['username', username])
}

module.exports = {
  passport,
  createUser
}
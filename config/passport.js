const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const validatePassword = require("../lib/passwordUtils").validatePassword;
const { PrismaClient } = require("@prisma/client");

// verify callback for new strategy
// done is where you pass results of the authentication to
// https://stackoverflow.com/questions/76855915/confused-help-understanding-passport-js-authenticate-user
// username/pw - value we recieved from request body of a login form

// NEED TO USE CUSTOM FIELDS AS EMAIL IS BEING USED INSTEAD OF USERNAME!
const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = (email, password, done) => {
  const prisma = new PrismaClient();

  prisma.User.findUnique({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (!user) {
        console.log("USER NOT FOUND");
        // user not present in DB
        // pass done callback to passport stating user was not found
        return done(null, false);
      }
      // function checking validity from utils -> compares password hash v.s stored hash
      // true or false
      const isValid = validatePassword(password, user.hash);

      if (isValid) {
        // validation passed
        return done(null, user);
      } else {
        console.log("invalid pass");
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
};

// new strategy requires verify callback
// localstrategy is the name of strategy found on passport's strategy list
const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

// this has to do with express session
// how we put user into session and out of session

// serialization defines how user information is stored in the session when user successfully authenticates.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// coming out of the session -> grabbing user ID stored in session finding it in Database
// this function retrieves userid  from session when request is made
passport.deserializeUser((userid, done) => {
  const prisma = new PrismaClient();
  prisma.User.findUnique({
    where: {
      id: userid,
    },
  })
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

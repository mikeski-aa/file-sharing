const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const passport = require("passport");
const genPassword = require("../lib/passwordUtils").genPassword;
const validatePassword = require("../lib/passwordUtils").validatePassword;

// GET homepage
exports.getIndex = asyncHandler(async (req, res, next) => {
  res.render("index", {
    user: req.user,
  });
});

// GET signup
exports.getRegister = asyncHandler(async (req, res, next) => {
  res.render("register");
});

// POST signup
exports.postRegister = [
  body("username", "Username must be more than 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("email", "Email is required").trim().escape(),
  body("password", "Password must be longer than 4 characters")
    .trim()
    .isLength({ min: 4 })
    .escape(),
  body("confirmPassword", "Password must be longer than 4 characters")
    .trim()
    .isLength({ min: 4 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // errors found, re render the page with error messages
      return res.render("register", {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        errors: errors.array(),
      });
    }

    if (req.body.password != req.body.confirmPassword) {
      // passwords are not matching, re render the page with appropriate information
      return res.render("register", {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        errors: [{ msg: "Passwords need to match!" }],
      });
    }

    try {
      const prisma = new PrismaClient();
      const emailCheck = await prisma.User.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (emailCheck != null) {
        return res.render("register", {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword,
          errors: [{ msg: "Email already in use, please pick another one" }],
        });
      }

      const hash = await genPassword(req.body.password);

      await prisma.User.create({
        data: {
          username: req.body.username,
          hash: hash,
          email: req.body.email,
        },
      });

      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }),
];

// GET login
exports.getLogin = asyncHandler(async (req, res, next) => {
  res.render("login");
});

// POST login
exports.postLogin = [
  body("email", "Email must not be empty").trim().escape(),
  body("password", "Password must not be empty").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // errors present, re render the login page
      res.render("login", {
        email: req.body.email,
        password: req.body.password,
        errors: errors.array(),
      });
    }

    try {
      const prisma = new PrismaClient();
      const user = await prisma.User.findUnique({
        where: {
          email: req.body.email,
        },
      });
      console.log(user);

      //   if (user == null) {
      //     return res.render("login", {
      //       email: req.body.email,
      //       password: req.body.password,
      //       errors: [{ msg: "Email or password entered is incorrect" }],
      //     });
      //   }
      //   const validateLogin = validatePassword(req.body.password, user.hash);
      //   console.log(validateLogin);
      //   if (validateLogin === false) {
      //     return res.render("login", {
      //       email: req.body.email,
      //       password: req.body.password,
      //       errors: [{ msg: "Email or password entered is incorrect" }],
      //     });
      //   }

      passport.authenticate("local", {
        successRedirect: "/register",
        failureRedirect: "/",
      })(req, res);
    } catch (error) {
      next(error);
    }
  }),
];

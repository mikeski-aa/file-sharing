var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
require("./config/passport");
const prisma = new PrismaClient();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// rate limiter for maximum of 20 requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, /// 1 minute
  max: 20,
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// set up prisma store
const prismaStore = new PrismaSessionStore(new PrismaClient(), {
  checkPeriod: 2 * 60 * 1000, //ms
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

app.use(limiter);

// set up session cookies
app.use(
  session({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: prismaStore,
  })
);

// set up passport use
app.use(passport.session());

// async function testDB() {
//   const test = await prisma.User.findMany();
//   console.log(test);
// }

// testDB();

app.use(bodyParser.json({ type: "application/*+json" }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { user: req.user });
});

module.exports = app;

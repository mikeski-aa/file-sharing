const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// GET homepage
exports.getIndex = asyncHandler(async (req, res, next) => {
  res.render("index");
});

// GET login
exports.getLogin = asyncHandler(async (req, res, next) => {
  res.render("signup");
});

// GET signup
exports.getSignup = asyncHandler(async (req, res, next) => {
  res.render("signup");
});

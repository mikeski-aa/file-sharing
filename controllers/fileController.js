const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const upload = multer({ dest: "uploads/" });

// GET new image
exports.getNewFile = asyncHandler(async (req, res, next) => {
  res.render("newfile", { user: req.user });
});

// POST new image
exports.postNewFile = [
  body("name", "Name must be at least two characters in length")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    upload.single(req.file);
    console.log(req.body.name);
    console.log(req.file);

    res.redirect("/");
  }),
];

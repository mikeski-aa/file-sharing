const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const upload = multer({ dest: "uploads/" });

// GET new image
exports.getNewFile = asyncHandler(async (req, res, next) => {
  const prisma = new PrismaClient();
  const folders = await prisma.Folder.findMany({
    where: { userId: req.user.id },
  });
  console.log(folders);
  res.render("newfile", { user: req.user, folders: folders });
});

// POST new image
exports.postNewFile = [
  body("name", "Name must be at least two characters in length")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const prisma = new PrismaClient();
    // Cloudinary configuration
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    await console.log("req.body.name:");
    console.log(req.body.name);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // errors found, re render

      const folders = await prisma.Folder.findMany({
        where: { userId: req.user.id },
      });
      console.log(req.body.name);
      return res.render("newfile", {
        user: req.user,
        name: req.body.name,
        file: req.file,
        folders: folders,
        errors: errors.array(),
      });
    }

    try {
      const response = await cloudinary.uploader
        .upload(req.file.path, {
          public_id: req.params.id,
        })
        .catch((error) => {
          console.log(error);
        });
      // we need to save the file in the server
      // we need to save the file in database with -> url to file, folder id, user id
    } catch (error) {
      next(error);
    }

    console.log("validation sucessful");
    // upload.single(req.file);
    console.log(req.body.name);
    console.log(req.body.folder);
    console.log(req.file);

    res.redirect("/");
  }),
];

/// PUG CODE FOR newfile

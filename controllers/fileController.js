const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const upload = multer({ dest: "uploads/" });
const { v4: uuidv4 } = require("uuid");

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

  body("folder").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const prisma = new PrismaClient();
    // Cloudinary configuration
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

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
      // we need to save the file in the server
      // we need to save the file in database with -> url to file, folder id, user id
      // need to generate unique ID for each file
      const fileId = uuidv4();
      const response = await cloudinary.uploader
        .upload(req.file.path, {
          public_id: fileId,
        })
        .catch((error) => {
          console.log(error);
        });

      // after file uploaded, we can save to our DB
      await prisma.File.create({
        data: {
          imageId: fileId,
          name: req.body.name,
          url: response.url,
          userId: req.user.id,
          folderId: +req.body.folder,
        },
      });

      return res.redirect("/");
    } catch (error) {
      next(error);
    }
  }),
];

/// PUG CODE FOR newfile

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const upload = multer({ dest: "uploads/" });
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { mkdir } = require("fs/promises");
const { Readable } = require("stream");
const { finished } = require("stream/promises");
const path = require("path");

// GET new image
exports.getNewFile = asyncHandler(async (req, res, next) => {
  const prisma = new PrismaClient();
  const folders = await prisma.Folder.findMany({
    where: { userId: req.user.id },
  });
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
    console.log("logging req.file");
    console.log(req.file);
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

      console.log(response);
      console.log(fileId);

      // after file uploaded, we can save to our DB
      await prisma.File.create({
        data: {
          imageId: fileId,
          name: req.body.name,
          url: response.url,
          userId: req.user.id,
          // converting to int -> int is expected by DB
          folderId: +req.body.folder,
        },
      });

      return res.redirect("/allfiles");
    } catch (error) {
      next(error);
    }
  }),
];

// GET all files
exports.getAllFiles = asyncHandler(async (req, res, next) => {
  const prisma = new PrismaClient();
  const allItems = await prisma.File.findMany({
    where: {
      userId: req.user.id,
    },
  });

  res.render("allfilelist", { user: req.user, files: allItems });
});

// GET file details
exports.getFileDetails = asyncHandler(async (req, res, next) => {
  const prisma = new PrismaClient();
  const item = await prisma.File.findUnique({
    where: {
      // converting to int -> int is expected by DB
      id: +req.params.id,
    },
  });

  res.render("filedetails", { user: req.user, file: item });
});

// GET file delete
exports.getFileDelete = asyncHandler(async (req, res, next) => {
  const prisma = new PrismaClient();
  const item = await prisma.File.findUnique({
    where: {
      // converting to int -> int is expected by DB
      id: +req.params.id,
    },
  });
  res.render("filedelete", { user: req.user, file: item });
});

// POST file delete
exports.postDeleteFile = asyncHandler(async (req, res, next) => {
  const prisma = new PrismaClient();
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    // need to destroy the file on cloudinary's site + the
    await cloudinary.uploader.destroy(+req.body.imageId, {
      resource_type: "raw",
    });

    await prisma.File.delete({
      where: {
        id: +req.params.id,
      },
    });

    res.redirect("/allfiles");
  } catch (error) {
    next(error);
  }
});

//post file download
exports.postDownloadFile = asyncHandler(async (req, res, next) => {
  console.log(req.body.imageid);
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  await cloudinary.api
    .resources_by_ids([req.body.imageid])
    .then((result) => console.log(result));

  const test = await fetch(
    "https://res.cloudinary.com/dyev7n9en/image/upload/v1722263961/2aba8a11-e23f-4265-a45e-f46327b4ba6e.png"
  );
  const downloadFile = async (url, fileName) => {
    const res = await fetch(url);
    if (!fs.existsSync("downloads")) await mkdir("downloads"); //Optional if you already have downloads directory
    const destination = path.resolve("./downloads", fileName);
    const fileStream = fs.createWriteStream(destination, { flags: "wx" });
    await finished(Readable.fromWeb(res.body).pipe(fileStream));
  };

  await downloadFile(
    "https://res.cloudinary.com/dyev7n9en/image/upload/v1722263961/2aba8a11-e23f-4265-a45e-f46327b4ba6e.png",
    "test.png"
  );

  console.log(test);

  res.redirect("/");
});

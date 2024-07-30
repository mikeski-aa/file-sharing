const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

// GET new folder
exports.getNewFolder = asyncHandler(async (req, res, next) => {
  res.render("newfolder", { user: req.user });
});

// POST new folder
exports.postNewFolder = [
  body("name", "The name must be at two characters long!")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    console.log("req.body.name:");
    console.log(req.body.name);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // name validation fail, re-render
      return res.render("newfolder", {
        user: req.user,
        name: req.body.name,
        errors: errors.array(),
      });
    }

    try {
      const prisma = new PrismaClient();
      await prisma.Folder.create({
        data: {
          name: req.body.name,
          userId: req.user.id,
        },
      });

      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }),
];

// GET FOLDER DETAILS
exports.getFolderDetails = asyncHandler(async (req, res, next) => {
  const prisma = new PrismaClient();
  const folder = await prisma.Folder.findUnique({
    where: {
      // converted to int
      id: +req.params.id,
    },
  });

  const items = await prisma.File.findMany({
    where: {
      folderId: folder.id,
    },
  });

  if (folder === null) {
    return res.redirect("/");
  }

  res.render("folderdetails", { user: req.user, folder: folder, items: items });
});

exports.getFolderDelete = asyncHandler(async (req, res, next) => {
  const prisma = new PrismaClient();
  const [folder, itemsInFolder] = await Promise.all([
    prisma.Folder.findUnique({
      where: {
        id: +req.params.id,
      },
    }),
    prisma.File.findMany({
      where: {
        folderId: +req.params.id,
      },
    }),
  ]);

  console.log(itemsInFolder);

  res.render("folderdelete", {
    user: req.user,
    folder: folder,
    items: itemsInFolder,
  });
});

//POST FOLDER DELETE
exports.postFolderDelete = asyncHandler(async (req, res, next) => {
  const prisma = new PrismaClient();
  const items = await prisma.File.findMany({
    where: {
      folderId: +req.params.id,
    },
  });

  const folder = await prisma.Folder.findUnique({
    where: {
      id: +req.params.id,
    },
  });

  if (items.length > 0) {
    return res.render(`/folder/delete/${req.params.id}`, {
      user: req.user,
      items: items,
      error: "Items need to be deleted form folder first!",
      folder: folder,
    });
  }

  await prisma.Folder.delete({
    where: {
      id: +req.params.id,
    },
  });
  res.redirect("/");
});

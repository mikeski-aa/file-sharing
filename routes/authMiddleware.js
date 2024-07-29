const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else
    res
      .status(401)
      .json({ message: "You are not authorized to view this resource" });
};

module.exports.isFileOwner = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const prisma = new PrismaClient();
    const file = await prisma.file.findFirst({
      where: {
        // convert to int
        id: +req.params.id,
        userId: +req.user.id,
      },
    });

    if (file === null) {
      res
        .status(401)
        .json({ message: "You are not authorized to view this resource" });
    }
    next();
  } else
    res
      .status(401)
      .json({ message: "You are not authorized to view this resource" });
});

module.exports.isFolderOwner = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const prisma = new PrismaClient();
    const file = await prisma.Folder.findFirst({
      where: {
        // convert to int
        id: +req.params.id,
        userId: +req.user.id,
      },
    });

    if (file === null) {
      res
        .status(401)
        .json({ message: "You are not authorized to view this resource" });
    }
    next();
  } else
    res
      .status(401)
      .json({ message: "You are not authorized to view this resource" });
});

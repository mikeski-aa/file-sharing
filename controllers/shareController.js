const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

exports.getSharedRoute = asyncHandler(async (req, res, next) => {
  try {
    const prisma = new PrismaClient();
    const [getFolder, getFolderItems] = await Promise.all([
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

    console.log(getFolder);
    console.log(getFolderItems);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

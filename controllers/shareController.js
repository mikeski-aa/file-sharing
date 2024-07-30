const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const deleteTest = require("../lib/helper").deleteTest;
const { v4: uuidv4 } = require("uuid");

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

    const generateID = uuidv4();

    await prisma.Test.create({
      data: {
        name: getFolder.name,
        uniqueId: generateID,
      },
    });

    setTimeout(() => deleteTest(generateID), 3600000);
    res.render("sharedFolder", { user: req.user, folder: getFolder });
  } catch (error) {
    next(error);
  }
});

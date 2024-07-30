const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const deleteTest = require("../lib/helper").deleteTest;
const { v4: uuidv4 } = require("uuid");

// get share form
exports.getShare = asyncHandler(async (req, res, next) => {
  const prisma = new PrismaClient();
  const folder = await prisma.Folder.findUnique({
    where: {
      id: +req.params.id,
    },
  });
  res.render("shareform", { user: req.user, folder: folder });
});

exports.getGenShareRoute = asyncHandler(async (req, res, next) => {
  // needs to check whether the folder already exists
  const prisma = new PrismaClient();
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + +req.body.timeperiod);
  const idGen = uuidv4();
  const newURL = idGen + "_" + req.params.id + "_" + req.user.id;
  console.log(newURL.split("_"));
  await prisma.Test.create({
    data: {
      expired: expireDate,
    },
  });

  res.redirect("/");
  //   const [getFolder, getFolderItems] = await Promise.all([
  //     prisma.Folder.findUnique({
  //       where: {
  //         id: +req.params.id,
  //       },
  //     }),
  //     prisma.File.findMany({
  //       where: {
  //         folderId: +req.params.id,
  //       },
  //     }),
  //   ]);
  //   const exist = await prisma.Test.findMany({
  //     where: {
  //       ownerId: +req.user.id,
  //       folderId: +getFolder.id,
  //     },
  //   });

  //   console.log(exist.length);
  //   if (exist.length > 0) {
  //     return res.render("sharedFolder", {
  //       user: req.user,
  //       folder: getFolder,
  //       items: getFolder,
  //     });
  //   }

  //   try {
  //     const [getFolder, getFolderItems] = await Promise.all([
  //       prisma.Folder.findUnique({
  //         where: {
  //           id: +req.params.id,
  //         },
  //       }),
  //       prisma.File.findMany({
  //         where: {
  //           folderId: +req.params.id,
  //         },
  //       }),
  //     ]);

  //     const generateID = uuidv4();

  //     await prisma.Test.create({
  //       data: {
  //         name: getFolder.name,
  //         folderId: +getFolder.id,
  //         ownerId: +req.user.id,
  //       },
  //     });

  //     setTimeout(() => deleteTest(getFolder.id, req.user.id), 6000);
  //     res.render("sharedFolder", {
  //       user: req.user,
  //       folder: getFolder,
  //       items: getFolder,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
});

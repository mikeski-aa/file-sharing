const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const getInfoFromUrl = require("../lib/helper").getInfoFromUrl;
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

  const [getFolder, getFolderItems, existCheck] = await Promise.all([
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
    prisma.Foldershare.findUnique({
      where: {
        id: +req.params.id,
      },
    }),
  ]);

  console.log(getFolderItems[0]);

  if (existCheck != null) {
    // if shared link has already been created render again with link to user
    return res.render("shareform", {
      user: req.user,
      existmsg: true,
      sharelink: existCheck.uniqueurl,
    });
  }

  // link has not been shared, create a new folder

  //   console.log(getFolderItems);

  await prisma.Foldershare.create({
    data: {
      id: +req.params.id,
      name: getFolder.name,
      userId: +req.user.id,
      expired: expireDate,
      uniqueurl: newURL,
    },
  });

  for (let x = 0; x < getFolderItems.length; x++) {
    await prisma.Fileshare.create({
      data: {
        imageId: getFolderItems[x].imageId,
        name: getFolderItems[x].name,
        url: getFolderItems[x].url,
        userId: +req.user.id,
        folderId: +req.params.id,
      },
    });
  }

  res.redirect("/");
});

// dispaly share folder
exports.getShareFolder = asyncHandler(async (req, res, next) => {
  const prisma = new PrismaClient();
  console.log(req.params.id);
  const params = getInfoFromUrl(req.params.id);

  const [getFolderItems, existCheck] = await Promise.all([
    prisma.Fileshare.findMany({
      where: {
        folderId: +params.folderId,
      },
    }),
    prisma.Foldershare.findUnique({
      where: {
        id: +params.folderId,
        userId: +params.userId,
      },
    }),
  ]);
  console.log(existCheck);

  if (existCheck == null) {
    // if incorrect url is given render an error
    return res.send("Error, wrong url!");
  }
  //   return res.send("Found the thing");
  res.render("sharedfolder", {
    user: req.user,
    folder: existCheck,
    items: getFolderItems,
  });
});

// display share item
exports.getShareItem = asyncHandler(async (req, res, next) => {
  const prisma = new PrismaClient();
  const fileid = req.params.id.split("_")[3];
  console.log(req.params.id);
  const temp = req.params.id.split("_");
  const backURL = temp[0] + "_" + temp[1] + "_" + temp[2];

  const item = await prisma.Fileshare.findUnique({
    where: {
      // converting to int -> int is expected by DB
      id: +fileid,
    },
  });

  res.render("sharedfile", { user: req.user, file: item, url: backURL });
});

const { PrismaClient } = require("@prisma/client");

// function needs to compare expire dates
// delete folder and item if expired
// this is probably not the best way to implement it, BUT I did not find anything
// about expirey dates auto deleting records in psql

module.exports.checkExpired = async function (req, res, next) {
  const prisma = new PrismaClient();
  const folders = await prisma.Foldershare.findMany();

  for (let x = 0; x < folders.length; x++) {
    if (Date.parse(new Date()) > Date.parse(folders[x].expired)) {
      // this means that the expirey date has passed, need to delete items.
      // delete files first
      // then delete folder
      await prisma.Fileshare.deleteMany({
        where: {
          folderId: folders[x].id,
        },
      });

      await prisma.Foldershare.delete({
        where: {
          id: folders[x].id,
        },
      });
    }
  }

  console.log(folders);
  next();
};

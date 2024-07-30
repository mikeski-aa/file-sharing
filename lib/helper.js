const { PrismaClient } = require("@prisma/client");

async function deleteTest(folderid, userid) {
  const prisma = new PrismaClient();

  await prisma.Test.delete({
    where: {
      folderId: +folderid,
      ownerId: +userid,
    },
  });
}

module.exports = {
  deleteTest,
};

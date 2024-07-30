const { PrismaClient } = require("@prisma/client");

async function deleteTest(target) {
  const prisma = new PrismaClient();

  await prisma.Test.delete({
    where: {
      uniqueId: target,
    },
  });
}

module.exports = {
  deleteTest,
};

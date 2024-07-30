const { PrismaClient } = require("@prisma/client");

function getInfoFromUrl(url) {
  const split = url.split("_");

  const details = {
    folderId: split[1],
    userId: split[2],
  };

  return details;
}

module.exports = {
  getInfoFromUrl,
};

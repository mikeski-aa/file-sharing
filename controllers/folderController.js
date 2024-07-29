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

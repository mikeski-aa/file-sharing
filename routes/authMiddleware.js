const asyncHandler = require("express-async-handler");

module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else
    res
      .status(401)
      .json({ message: "You are not authorized to view this resource" });
};

module.exports.isOwner = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.params);
    console.log(req.user);

    next();
  } else
    res
      .status(401)
      .json({ message: "You are not authorized to view this resource" });
});

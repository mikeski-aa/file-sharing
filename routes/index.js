const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");

/* GET home page. */
router.get("/", mainController.getIndex);

// get login page
router.get("/login", mainController.getLogin);

// get signup page
router.get("/signup", mainController.getSignup);

module.exports = router;

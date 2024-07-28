const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");

/* GET home page. */
router.get("/", mainController.getIndex);

// GET register page
router.get("/register", mainController.getRegister);

// POST register page
router.post("/register", mainController.postRegister);

// GET login page
router.get("/login", mainController.getLogin);

// POST login page
router.post("/login", mainController.postLogin);

module.exports = router;

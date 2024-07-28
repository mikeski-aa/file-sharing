const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");
const folderController = require("../controllers/folderController");

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

// GET logout page
router.get("/logout", mainController.getLogout);

// GET new folder page
router.get("/newfolder", folderController.getNewFolder);

// POST new folder
router.post("/newfolder", folderController.postNewFolder);

// GET new file page
router.get("/newfile", mainController.getNewFile);

module.exports = router;

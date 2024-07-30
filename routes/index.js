const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");
const folderController = require("../controllers/folderController");
const shareController = require("../controllers/shareController");
const fileController = require("../controllers/fileController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const isFileOwner = require("./authMiddleware").isFileOwner;
const isFolderOwner = require("./authMiddleware").isFolderOwner;
const isAuth = require("./authMiddleware").isAuth;

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
router.get("/logout", isAuth, mainController.getLogout);

// GET new folder page
router.get("/newfolder", isAuth, folderController.getNewFolder);

// POST new folder
router.post("/newfolder", isAuth, folderController.postNewFolder);

// GET new file page
router.get("/newfile", isAuth, fileController.getNewFile);

// POST new file page
// multer needs to be inserted here
router.post(
  "/newfile",
  isAuth,
  upload.single("image"),
  fileController.postNewFile
);

// GET list of all files
router.get("/allfiles", isAuth, fileController.getAllFiles);

// GET specific file details
router.get("/file/:id", isFileOwner, fileController.getFileDetails);

// POST download file
router.post("/file/:id", isFileOwner, fileController.postDownloadFile);

// GET delete specific file
router.get("/file/:id/delete", isFileOwner, fileController.getFileDelete);

// POST delete specific file
router.post("/file/:id/delete", isFileOwner, fileController.postDeleteFile);

// GET specific folder
router.get("/folder/:id", isFolderOwner, folderController.getFolderDetails);

// POST delete specific folder
router.post("/folder/:id", isFolderOwner, folderController.postFolderDelete);

// GET share route
router.get("/share/:id", shareController.getSharedRoute);

module.exports = router;


const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken")
const usersControllers = require("../controllers/users.controllers")
const multer = require("multer");
const appError = require("../utils/appError");

const diskStorage = multer.diskStorage({
  destination : function (req, file ,cb) {
    console.log("FILE", file)
    cb(null, 'uploads')
  },
  filename : function(req, file, cb) {
    const ext = file.mimetype.split('/')[1]
    const fileName = `user-${Date.now()}.${ext}`
    cb(null,fileName)
  }
})

const fileFilter = (req,file,cb) => {
  const imageType = file.mimetype.split('/')[0]
  if (imageType === "image") {
    return cb(null,true)
  }else {
    return cb(appError.create("file must be in image",400),false)
  }
}
const upload = multer({ storage : diskStorage,
  fileFilter
})

router
  .route("/") // Defines the root route ("/")
  .get(verifyToken,usersControllers.getAllUsers); // Handles GET requests

router
  .route("/register") // Defines the "/register" route
  .post(upload.single('avatar'),usersControllers.register); // Handles POST requests

router
  .route("/login") // Defines the "/login" route
  .post(usersControllers.login); // Handles POST requests


module.exports = router;

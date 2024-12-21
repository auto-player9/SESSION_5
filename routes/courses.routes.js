const controllers = require("../controllers/courses.controllers");
const express = require("express");
const router = express.Router();
const validationSchema = require("../middlewares/validationSchema")
const verifyToken = require("../middlewares/verifyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middlewares/allowedTo")
router
  .route("/")
  .get(controllers.getAllCourses)
  .post(
    validationSchema.middleware,
    controllers.addCourse
  );

router
  .route("/:id")
  .get(controllers.getCourse)
  .patch(controllers.updateCourse)
  .delete(verifyToken ,allowedTo(userRoles.ADMIN,userRoles.MANAGER), controllers.deleteCourse);

module.exports = router;

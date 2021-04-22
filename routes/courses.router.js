const express = require("express");
const router = express.Router({
  mergeParams: true,
});
const resultFilter = require("../middlewares/resultFiltering");
const Course = require("../models/Course");

const { protect, authorize } = require("../middlewares/auth.middleware");

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses.controller");

router
  .route("/")
  .get(
    resultFilter(Course, { path: "bootcamp", select: "name description" }),
    getCourses
  )
  .post(protect, authorize("publisher", "admin"), addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;

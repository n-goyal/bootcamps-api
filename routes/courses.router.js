const express = require("express");
const router = express.Router({
  mergeParams: true,
});
const resultFilter = require("../middlewares/resultFiltering");
const Course = require("../models/Course");

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
    resultFilter(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(addCourse);

router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;

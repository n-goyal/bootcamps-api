const express = require("express");
const router = express.Router();

const {
  getBootcamp,
  getBootcamps,
  deleteBootcamp,
  updateBootcamp,
  createBootcamp,
  getBootcampInRadius,
} = require("../controllers/bootcamps.controller");

// other resource routers
const courseRouter = require("./courses.router");
// route the request to courses router
router.use("/:bootcampId/courses", courseRouter);

// bootcamp routes
router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router.route("/").get(getBootcamps).post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;

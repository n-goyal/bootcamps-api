const express = require("express");
const router = express.Router();

const resultFilter = require("../middlewares/resultFiltering");
const Bootcamp = require("../models/Bootcamps");

const {
  getBootcamp,
  getBootcamps,
  deleteBootcamp,
  updateBootcamp,
  createBootcamp,
  getBootcampInRadius,
  uploadBootcampPhoto,
} = require("../controllers/bootcamps.controller");

// other resource routers
const courseRouter = require("./courses.router");
// forward the request to courses router
router.use("/:bootcampId/courses", courseRouter);

// bootcamp routes
router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router
  .route("/")
  .get(resultFilter(Bootcamp, "courses"), getBootcamps)
  .post(createBootcamp);

router.route("/:id/photo").put(uploadBootcampPhoto);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;

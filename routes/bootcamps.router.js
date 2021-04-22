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

const { protect, authorize } = require("../middlewares/auth.middleware");

// other resource routers
const courseRouter = require("./courses.router");
// forward the request to courses router
router.use("/:bootcampId/courses", courseRouter);

// bootcamp routes
router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router
  .route("/")
  .get(resultFilter(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), uploadBootcampPhoto);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

module.exports = router;

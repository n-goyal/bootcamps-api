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

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router.route("/").get(getBootcamps).post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;

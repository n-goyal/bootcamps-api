const express = require("express");

const router = express.Router({ mergeParams: true });

const User = require("../models/User");

const filteredResults = require("../middlewares/resultFiltering");
const { protect, authorize } = require("../middlewares/auth.middleware");

// protect all routes
router.use(protect);
router.use(authorize("admin"));

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller");

router.route("/").get(filteredResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;

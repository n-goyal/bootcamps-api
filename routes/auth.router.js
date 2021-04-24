const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatepassword,
} = require("../controllers/auth.controller");

const { protect } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, getMe);
router.put("/updateDetails", protect, updateDetails);
router.put("/updatePassword", protect, updatepassword);

router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;

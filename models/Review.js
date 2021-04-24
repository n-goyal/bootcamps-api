const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title of review"],
    maxLength: 100,
  },
  text: {
    required: [true, "Please add some text"],
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating(1 - 10)"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);

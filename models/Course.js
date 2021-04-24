const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: Number,
    required: [true, "Please add a number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tution"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add minimum skills"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false,
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

// middleware
// get statics for course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log("Calculating aggregating costs");
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.error(error);
  }
};
// getAverageCost after save
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// getAverageCost before remove
CourseSchema.remove("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);

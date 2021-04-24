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

// One user can add one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// get average rating for a bootcamp and save
ReviewSchema.statics.averageRating = async function (bootcampId) {
  // grab bootcamps
  console.log("Updating bootcamp rating...");
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.error(error);
  }
};

ReviewSchema.pre("save", function () {
  this.constructor.averageRating(this.bootcamp);
});

ReviewSchema.post("remove", function () {
  this.constructor.averageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);

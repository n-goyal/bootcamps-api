const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamps");

/**
@desc    Get all courses
@route   GET /api/v1/courses
@route   GET /api/v1/bootcamps/:bootcampId/courses
@access  Public
*/
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.filteredResults);
  }
});

/**
@desc    Get all courses
@route   POST /api/v1/courses/:id
@access  Private
*/
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  // get user
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No Bootcamp with id of ${req.params.bootcampId}`, 404)
    );
  }
  // make sure bootcamp owner is logged in user
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to Bootcamp ${bootcamp._id}`,
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: "true",
    data: course,
  });
});

/**
@desc    Get all courses
@route   GET /api/v1/courses
@route   GET /api/v1/bootcamps/:bootcampId/courses
@access  Public
*/
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await (await Course.findById(req.params.id)).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(new ErrorResponse(`No Course with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: "true",
    data: course,
  });
});

/**
@desc    update Course
@route   PUT /api/v1/courses/:id
@access  Private
*/
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No Course with id of ${req.params.id}`, 404)
    );
  }

  // make sure course owner is logged in user
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this course`,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: "true",
    data: course,
  });
});

/**
@desc    delete Course
@route   DELETE /api/v1/courses/:id
@access  Private
*/
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No Course with id of ${req.params.id}`, 404)
    );
  }

  // make sure course owner is logged in user
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this course`,
        401
      )
    );
  }

  course.remove();

  res.status(200).json({
    success: "true",
    data: {},
  });
});

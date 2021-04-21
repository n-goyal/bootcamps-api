const Bootcamp = require("../models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geoCoder = require("../utils/geoCoder");
const path = require("path");
/**
@desc    Get all bootcamps
@route   GET /api/v1/bootcamps
@access  Public
*/
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.filteredResults);
});

/**
@desc    Get all bootcamps
@route   GET /api/v1/bootcamps/:id
@access  Public
*/
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

/**
@desc    Get bootcamps within radius
@route   GET /api/v1/bootcamps/radius/:zipcode/:distance
@access  Private
*/
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geoCoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // divide distance by radius of earth i.e. 3,963 miles / 6,378 kilometers
  const EARTH_RADIUS = 6378;
  const radius = distance / EARTH_RADIUS;
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

/**
@desc    Get all bootcamps
@route   POST /api/v1/bootcamps
@access  Private
*/
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

/**
@desc    Get all bootcamps
@route   PUT /api/v1/bootcamps/:id
@access  Private
*/
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  res.status(202).json({
    success: true,
    data: bootcamp,
  });
});

/**
@desc    Get all bootcamps
@route   DELETE /api/v1/bootcamps/:id
@access  Private
*/
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  // triggers mongoose middleware
  bootcamp.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
@desc    Update photo for bootcamp
@route   PUT /api/v1/bootcamps/:id/photo
@access  Private
*/
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 400)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file.`, 400));
  }

  // make sure file is image
  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file.`, 400));
  }

  // file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image file less than ${process.env.MAX_FILE_UPLOAD}.`,
        400
      )
    );
  }

  // change file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Error with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
  });

  res.status(202).json({
    success: true,
    data: file.name,
  });
});

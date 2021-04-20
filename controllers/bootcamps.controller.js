const Bootcamp = require("../models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geoCoder = require("../utils/geoCoder");
/**
@desc    Get all bootcamps
@route   GET /api/v1/bootcamps
@access  Public
*/
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  // copy req.query
  const reqQuery = { ...req.query };

  // fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // loop over removeFields, delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // convert it to query string
  let queryStr = JSON.stringify(reqQuery);

  // replace gt => $gt
  queryStr = queryStr.replace(
    "/\b(gt|get|lt|lte|in)\b/g",
    (match) => `$${match}`
  );

  // finding resource
  query = Bootcamp.find(JSON.parse(queryStr));
  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  // sort by fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;
  const total = await Bootcamp.countDocuments();
  query = query.skip(startIdx).limit(limit);

  // exicuting query
  const bootcamps = await query;

  const pagination = {};

  if (endIdx < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIdx > 0) {
    pagination.previous = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    pagination,
    count: bootcamps.length,
    data: bootcamps,
  });
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
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: {},
  });
});

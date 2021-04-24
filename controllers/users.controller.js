const User = require("../models/User");

const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");

const asyncHandler = require("../middlewares/async");

/**
@desc    Get All User
@route   GET /api/v1/users
@access  Private/Admin
*/
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.filteredResults);
});

/**
@desc    Get User
@route   GET /api/v1/users/:id
@access  Private/Admin
*/
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
@desc    create a User
@route   POST /api/v1/users/
@access  Private/Admin
*/
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
@desc    update a User
@route   PUT /api/v1/users/:id
@access  Private/Admin
*/
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  user.save();
  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
@desc    delete a User
@route   POST /api/v1/users/:id
@access  Private/Admin
*/
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
@desc    Get all bootcamps
@route   GET /api/v1/bootcamps
@access  Public
*/
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
  });
};

/**
@desc    Get all bootcamps
@route   GET /api/v1/bootcamps/:id
@access  Public
*/
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
  });
};

/**
@desc    Get all bootcamps
@route   POST /api/v1/bootcamps
@access  Private
*/
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
  });
};

/**
@desc    Get all bootcamps
@route   PUT /api/v1/bootcamps/:id
@access  Private
*/
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
  });
};

/**
@desc    Get all bootcamps
@route   DELETE /api/v1/bootcamps/:id
@access  Private
*/
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
  });
};

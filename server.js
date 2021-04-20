const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error.middleware");
// get environments configurations
dotenv.config({ path: "./config/config.env" });
const port = process.env.PORT || 5000;

// connect db
connectDB();
// import routers
const bootcamps = require("./routes/bootcamps.router");
const courses = require("./routes/courses.router");
// const { connect } = require("./routes/bootcamps.router");

const app = express();

// body parser
app.use(express.json());

// dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

// error-middleware
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode at ${port}`.yellow.bold
  );
});

// handle promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server, exit process
  server.close(() => {
    process.exit(1);
  });
});

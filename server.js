const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const path = require("path");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

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
const auth = require("./routes/auth.router");
const users = require("./routes/users.router");
const reviews = require("./routes/reviews.router");

const app = express();

// middlwares
app.use(express.json());
app.use(cookieParser());

// SQL injection prevention
app.use(mongoSanitize());

// dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// fileupload middleware
app.use(fileupload());

// server statics
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

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

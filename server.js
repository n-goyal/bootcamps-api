const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// get environments configurations
dotenv.config({ path: "./config/config.env" });
const port = process.env.PORT || 5000;

// import routers
const bootcamps = require("./routes/bootcamps.router");

const app = express();

// dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// routes
app.use("/api/v1/bootcamps", bootcamps);

app.listen(port, () => {
  console.log(`server is running in ${process.env.NODE_ENV} mode at ${port}`);
});

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger.json");
var cors = require("cors");
// const mongoose = require("mongoose");
// mongoose.set("debug", true);
/**Routes file  */
var indexRouter = require("./routes/index");
var users = require("./routes/users");
var adminRouter = require("./routes/admin");
const { Error_Logs } = require("./app/logs/model/logModal");
const handleResponse = require('./middleware/handleResponse');
const _tokenManager = require("./middleware/auth");
var bodyParser = require('body-parser');

/**end */
var app = express();
/**
 * Middlewares
*/
app.use(
  cors({
    origin: "*",
  })
);
// view engine setup
app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));
//end
require("./helpers/logger");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
/**for root endpoint only */
app.get('/', function (req, res, next) {
  res.send({ message: "Welcome to PRIVATE MARKETS server" })
})
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/public", express.static(path.join(__dirname, "/public/")));
app.use("/api/uploads", express.static(path.join(__dirname, "/uploads/")));

app.use("/api/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/api", indexRouter);
app.use("/api/users", _tokenManager.authenticate, users, handleResponse.RESPONSE);
app.use("/api/admin", _tokenManager.admin, adminRouter, handleResponse.RESPONSE);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(async function (err, req, res, next) {
  // set locals, only providing error in development
  const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;
  let payload = {
    errorCode: err?.statusCode || 500,
    errorName: req?.newRespData?.message || err?.message,
    description: err?.stack,
    ip: ipAddress,
  };
  await Error_Logs.create(payload)
  if (err.statusCode === 404) {
    return res.status(404).send({ message: "Not Found !" })
  }
});


module.exports = app;

/** 
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const jwt = require("jsonwebtoken");
const { CONST } = require("../helpers/constant");
const { USER } = require("../app/userService/model/userModel");
const dotenv = require("dotenv");
// config dotenv in order to load environment variables into node process
dotenv.config();

const _tokenManager = {};

// check token for user roles
_tokenManager.authenticate = async (req, res, next) => {
  if (req.headers["authorization"]) {
    let token = getToken(req);
    const secret = process.env.JWT_SECRET || "Development";
    jwt.verify(token, secret, async (err, decoded) => {
      if (decoded) {
        const checkUser = await USER.findOne({
          _id: decoded.userId,
        });
        if (checkUser?.state == CONST.INACTIVE) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }
        if (checkUser?.token == "") {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }
        req.user = checkUser;
        req.userId = decoded.userId;
        req.roleId = decoded.roleId;
        req.email = decoded.email;
        req.token = token;
        next();
      } else {
        return res.status(403).json({
          success: false,
          dateCheck: CONST.dateCheck,
          message: "Invalid token",
        });
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      dateCheck: CONST.dateCheck,
      message: "Authentication token not provided",
    });
  }
};

const getToken = function (req) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Handle token presented as a Bearer token in the Authorization header
    return req.headers.authorization.split(" ")[1];
  }
  // If we return null, we couldn't find a token.
  // In this case, the JWT middleware will return a 401 (unauthorized)
  // to the client for this request
  return null;
};

_tokenManager.auth = (req, res, next) => {
  if (req.headers["authorization"]) {
    const token = getToken(req);
    const secret = process.env.JWT_SECRET || "Development";
    var decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    next();
  } else {
    next();
  }
};

/**Admin middleware */
_tokenManager.admin = (req, res, next) => {
  if (req.headers["authorization"]) {
    let token = getToken(req);
    const secret = process.env.JWT_SECRET || "Development";
    jwt.verify(token, secret, async (err, decoded) => {
      if (decoded) {
        const checkUser = await USER.findOne({
          _id: decoded.userId,
        });
        if (checkUser?.token == "") {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }
        if (checkUser?.roleId != CONST.ADMIN) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "unauthorized access",
          });
        }
        req.user = checkUser;
        req.userId = decoded.userId;
        req.roleId = decoded.roleId;
        req.email = decoded.email;
        req.token = token;
        next();
      } else {
        return res.status(403).json({
          success: false,
          dateCheck: CONST.dateCheck,
          message: "Invalid token",
        });
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      dateCheck: CONST.dateCheck,
      message: "Authentication token not provided",
    });
  }
};

module.exports = _tokenManager;

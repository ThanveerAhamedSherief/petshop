const jwt = require("jsonwebtoken");
const { secretkey } = require("../config/config");
const { customizeResponse } = require("../utils/customResponse");

function authenticateAdminToken(req, res, next) {
  let token = req.header("Authorization");
  token = token.slice(7);
  if (!token) {
    return res
      .status(200)
      .json(customizeResponse(false,"PB_ERROR_CODE_12", "Authorization token is missing."));
  }
  try {
    const decodedToken = jwt.verify(token, secretkey);
    if (decodedToken["role"] === "admin") {
      req.user = decodedToken;
      next();
    } else {
      return res.status(200).json(customizeResponse(false,"PB_ERROR_CODE_05", "Access forbidden"));
    }
  } catch (error) {
    return res.status(200).json(customizeResponse(false,"PB_ERROR_CODE_12", "Invalid token."));
  }
}
function authenticateUserToken(req, res, next) {
  let token = req.header("Authorization");
  if (!token) {
    return res
      .status(200)
      .json(customizeResponse(false,"PB_ERROR_CODE_12", "Authorization token is missing."));
  }
  token = token.slice(7);
  try {
    const decodedToken = jwt.verify(token, secretkey);
    console.log("<=====token decoded==>", )

    if (decodedToken["role"] === "user") {
      req.user = decodedToken;
      next();
    } else {
      return res.status(200).json(customizeResponse(false,"PB_ERROR_CODE_05", "Access forbidden"));
    }
  } catch (error) {
    return res.status(200).json(customizeResponse(false,"PB_ERROR_CODE_12", "Invalid token."));
  }
}
module.exports = {authenticateAdminToken, authenticateUserToken};

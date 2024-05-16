const jwt = require("jsonwebtoken");
const { secretkey } = require("../config/config");
const { customizeResponse } = require("../utils/customResponse");

function authenticateAdminToken(req, res, next) {
  let token = req.header("Authorization");
  token = token.slice(7);
  if (!token) {
    return res
      .status(401)
      .json(customizeResponse(false, "Authorization token is missing."));
  }
  try {
    const decodedToken = jwt.verify(token, secretkey);
    if (decodedToken["role"] === "admin") {
      req.user = decodedToken;
      next();
    } else {
      return res.status(403).json(customizeResponse(false, "Access forbidden"));
    }
  } catch (error) {
    return res.status(401).json(customizeResponse(false, "Invalid token."));
  }
}
module.exports = authenticateAdminToken;

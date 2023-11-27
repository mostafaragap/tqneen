const jwt = require('jsonwebtoken');
const { CustomError } = require("../utils/error");
const User = require("../models/user");
const { FORBIDDEN, UNAUTHORIZED } = require("../constants/status-codes");

module.exports = function auth(_permittedRoles) {

  const permittedRoles = [..._permittedRoles];
  return async (req, res, next) => {
    try {
      const token = extractTokenBasedOnRequestPlatform(req);
      if (!token) throw new CustomError("token not provided", UNAUTHORIZED);
      const decodedToken = verifyAndDecodeToken(token);
      const isPermitted = await isUserRolePermitted(decodedToken.userId, permittedRoles);
      if (isPermitted) {
        req.userId = decodedToken.userId || null;
        req.type = decodedToken.type || null
        req.id = decodedToken.id || null
        next();
      }
      else {
        throw new CustomError("forbidden", FORBIDDEN);
      }
    } catch (err) {
      next(err);
    }
  };
};


function extractTokenBasedOnRequestPlatform(req) {
  if (req.headers.authorization) return req.headers.authorization.split(' ')[1];
  return null;
}

function verifyAndDecodeToken(token) {
  try {
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) throw new CustomError("forbidden", FORBIDDEN);

    return decodedToken;
  } catch (err) {
    if (err.name == 'TokenExpiredError') throw new CustomError("Token Expired", UNAUTHORIZED)
    throw new CustomError("forbidden", FORBIDDEN);
  }
}

async function isUserRolePermitted(userId, permittedRoles) {
  const user = await User.findById(userId);
  if (!user) throw new CustomError("user not found", 401);
  if (!user.is_active) throw new CustomError("sorry you can't do this action now, please contact admin", 401);

  if (user && permittedRoles.includes(user.type)) return true
  return false;
}

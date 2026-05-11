const users = require("../models/users.js");
const questions = require("../models/question.js");

const isAuthenticated = function (req, res, next) {
  let token = req.get("X-Authorization");

  if (!token) {
    console.error("Token missing");
    return res.status(401).json({ error_message: "Token is required" });
  }

  users.getIdFromToken(token, (err, id) => {
    if (err || id === null) {
      console.error("Error fetching user ID from token:", err);
      return res
        .status(401)
        .json({ error_message: "Unauthorised: Invalid or expired token" });
    }
    req.user_id = id;
    next();
  });
};

module.exports = {
  isAuthenticated,
};

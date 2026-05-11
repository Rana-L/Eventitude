const crypto = require("crypto");
const db = require("../../database.js");

const getHash = function (password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 256, "sha256")
    .toString("hex");
};

// create an account
const NewUser = (user, done) => {
  const salt = crypto.randomBytes(64);
  const hash = getHash(user.password, salt);

  const sql =
    "INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?, ?, ?, ?, ?)";
  let values = [
    user.first_name,
    user.last_name,
    user.email,
    hash,
    salt.toString("hex"),
  ];

  const checkEmail = "SELECT * FROM users WHERE email = ?";

  db.get(checkEmail, [user.email], (err, row) => {
    if (err) {
      return done(err);
    }
    if (row) {
      return done(new Error("Email already exists"));
    }

    db.run(sql, values, function (err) {
      if (err) {
        return done(err);
      }

      return done(null, { user_id: this.lastID });
    });
  });
};

// Logging in
const authenticateUser = (email, password, done) => {
  const sql = "SELECT user_id, password, salt FROM users WHERE email = ?";

  db.get(sql, [email], (err, row) => {
    if (err) return done(err);
    if (!row) return done(404); // wrong email

    if (row.salt === null) row.salt = "";

    let salt = Buffer.from(row.salt, "hex");

    if (row.password === getHash(password, salt)) {
      return done(false, row.user_id);
    } else {
      return done(404); // wrong password
    }
  });
};

const getToken = (id, done) => {
  const sql = "SELECT session_token FROM users WHERE user_id = ?";

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Database error during token lookup:", err);
      return done(err);
    }

    if (!row) {
      console.error("No user found for the provided user_id");
      return done(new Error("User not found"));
    }
    return done(null, row.session_token);
  });
};

const setToken = (id, done) => {
  let token = crypto.randomBytes(64).toString("hex");
  const sql = "UPDATE users SET session_token = ? WHERE user_id = ?";

  db.run(sql, [token, id], function (err) {
    if (err) {
      console.error("Error updating token:", err.message);
    }

    console.log("Token updated in database for user_id:", id);
    console.log("New token:", token);

    return done(null, token);
  });
};

// Logging out
const removeToken = (token, done) => {
  console.log("Invalidating token:", token);
  const sql = "UPDATE users SET session_token = NULL WHERE session_token = ?";

  db.run(sql, [token], function (err) {
    if (err) {
      console.error("Error invalidating token:", err);
      return done(err);
    }
    return done(null);
  });
};

const getIdFromToken = (token, done) => {
  const sql = "SELECT user_id FROM users WHERE session_token = ?";
  const params = [token];

  db.get(sql, params, (err, row) => {
    if (err) {
      console.error("Database error during token lookup:", err);
      return done(err);
    }

    if (!row) {
      console.error("No user found for the provided user_id");
      return done(new Error("Invalid token"));
    }

    return done(null, row.user_id);
  });
};

module.exports = {
  getHash,
  setToken,
  removeToken,
  NewUser,
  authenticateUser,
  getIdFromToken,
  getToken,
};

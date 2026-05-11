const Joi = require("joi");
const app = require("express");
const users = require("../models/users.js");

const create_account_validation = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string()
    .pattern(
      new RegExp("^[a-zA-Z0-9!@#$%^&*()_+={}\\[\\]:;\"'<>,.?/\\\\|-]{3,30}$")
    )
    .pattern(new RegExp("[0-9]"), "Password must contain a number")
    .pattern(new RegExp("[a-z]"), "Password must contain a lowercase letter")
    .pattern(new RegExp("[A-Z]"), "Password must contain an uppercase letter")
    .min(8)
    .max(30)
    .required(),
});

const create_account = (req, res) => {
  const { error } = create_account_validation.validate(req.body);

  if (error) {
    return res.status(400).json({ error_message: error.details[0].message });
  }

  users.NewUser(req.body, (err, user) => {
    if (err) {
      return res.status(400).json({ error_message: "Error creating account" });
    }

    res.status(201).json({
      message: "Account created successfully",
      user_id: user.user_id,
    });
  });
};

const login_validation = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string()
    .pattern(
      new RegExp("^[a-zA-Z0-9!@#$%^&*()_+={}\\[\\]:;\"'<>,.?/\\\\|-]{3,30}$")
    )
    .required(),
});

const login = (req, res) => {
  const { error } = login_validation.validate(req.body);
  if (error) {
    return res.status(400).json({ error_message: error.details[0].message });
  }

  users.authenticateUser(req.body.email, req.body.password, (err, id) => {
    if (err === 404) {
      console.error("Invalid credentials", err);
      return res
        .status(400)
        .json({ error_message: "Invalid email or password entered" });
    }

    if (err) {
      console.error("Authentication error", err);
      return res
        .status(500)
        .json({ error_message: "Error during authentication" });
    }

    console.log("Authenticated user_id:", id);

    users.getToken(id, (tokenErr, token) => {
      if (tokenErr) {
        console.error("Error fetching token for user_id:", id, tokenErr);
        return res
          .status(500)
          .json({ error_message: "Error while getting session token" });
      }

      if (token) {
        console.log("User already has a token:", token);
        return res.status(200).json({
          user_id: id,
          session_token: token,
          message: "Login successful",
        });
      }

      users.setToken(id, (setTokenErr, newToken) => {
        if (setTokenErr) {
          return res
            .status(500)
            .json({ error_message: "Error while setting token" });
        }

        console.log("Generated new token:", newToken);

        return res.status(200).json({
          user_id: id,
          session_token: newToken,
          message: "Login successful",
        });
      });
    });
  });
};

const logout_validation = Joi.object({
  user_id: Joi.number(),
});

const logout = (req, res) => {
  const { error } = logout_validation.validate(req.body);
  if (error) {
    console.error("Validation error:", error.details[0].message);
    return res.status(400).json({ error_message: error.details[0].message });
  }

  const token = req.get("X-Authorization");
  console.log("Token received in header:", token);
  console.log("Request body:", req.body);

  if (!token) {
    console.warn("No token provided in the request");
    return res
      .status(401)
      .json({ error_message: "Unauthorised: No token provided" });
  }

  users.removeToken(token, (err) => {
    if (err) {
      console.error("Error during token removal:", err);
      if (err.message === "Invalid or expired token") {
        return res
          .status(401)
          .json({ error_message: "Invalid or expired token" });
      }
      return res.status(500).json({ error_message: "Error logging out" });
    }

    console.log(`User with token ${token} logged out successfully.`);
    return res.status(200).json({ message: "User successfully logged out" });
  });
};

module.exports = {
  create_account,
  login,
  logout,
};

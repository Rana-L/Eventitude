const express = require("express");
const Joi = require("joi");
const app = require("express");
const users = require("../models/users.js");

const create_account_validation = Joi.object({
    first_name: Joi.string().alphanum().min(4).max(30).required().messages({"string.empty": "First name is required"}),
    last_name: Joi.string().alphanum().min(4).max(30).required().messages({"string.empty": "Last name is required"}),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required().messages({"string.empty": "Email is required"}),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).min(3).max(30).required().messages({"string.empty": "Password is required",
    "string.min": "Password must be atleast 3 characters","string.max": "Password show be no more than 30 characters"})
    .pattern(new RegExp("[0-9]"), "Password must contain a number"),
    repeat_password: Joi.valid(Joi.ref("password")).required().messages({"any.only": "Passwords do not match"}),
    access_token: [ Joi.string(), Joi.number()]
})

const create_account = (req, res) => {
    const { error } = create_account_validation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    
    users.NewUser(req.body, (err, user_id) => {
        if (err) {
            if (err.message === "Email already exists") {
                return res.status(400).json({ error_message: "Email already exists" });
            }
            return res.status(400).json({ error_message: "Invalid user creation" });
        } 
        
        if (user_id) {
            return res.status(201).json({  message: "Account created successfully", user_id: user_id });
        } else {
            return res.status(500).json({ error_message: "Error  Account not created" });
        }
    });
};


const login_validation = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    access_token:[Joi.string(), Joi.number()]
});
    

const login = (req, res) => {
    const { error } = login_validation.validate(req.body);
    if (error) {
        return res.status(400).json({ error_message: error.details[0].message });
    }

    users.authenticateUser(req.body.email, req.body.password, (err, id) => {
        if(err === 404) 
            return res.status(400).send({ error_message: "Invalid email or password entered"});
        if (err) {
            return res.sendStatus(500).send({ error_message: "Error during authentication" });
        }
            users.getToken(id, (err, token) => {
                if (err) {
                    return res.sendStatus(500).send({ error_message: "Error while getting token" });
                }
                
                if(token){
                    return res.status(200).json({user_id: id, session_token: token})
                }else{
                    users.setToken(id, (err, NewToken) => {
                        if (err) {
                            return res.sendStatus(500).send({ error_message: "Error while setting token" });
                        }
                    return res.status(200).json({user_id: id, session_token: NewToken, message: "Login successful"});
                });
            }
        });
    });
};
   
const logout_validation = Joi.object({
    user_id: Joi.number().required(), 
});
 

const logout = (req, res) => {
    const { error } = logout_validation.validate(req.body);
    if (error) {
        return res.status(400).json({ error_message: error.details[0].message});
    }

    const token = req.get("X-Authorization");

    users.removeToken(token, (err) => {
        if (err) {
            return res.status(500).json({ error_message: "Error logging out" });
        }
        return res.status(200).json({ message: "Logout successful" });
    });
};

module.exports = {
    create_account,
    login,
    logout
};
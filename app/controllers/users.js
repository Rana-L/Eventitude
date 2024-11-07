const express = require("express");
const Joi = require("joi");
const app = require("express");
 

const create_account_validation = Joi.object({
    first_name: Joi.string().alphanum().min(4).max(30).required(),
    last_name: Joi.string().alphanum().min(4).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),

    repeat_password: Joi.ref("password"),

    access_token: [
        Joi.string(),
        Joi.number()
    ]
})

const login_validation = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
   
    repeat_password: Joi.ref("password"),

    access_token: [
        Joi.string(),
        Joi.number()
    ]
})

const logout_validation = Joi.object({
    
})
 

 // controller main body
const create_account = (req, res) => {
    const { error } = create_account_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {

        const accountCreated = true; // this is boolean value to placehold the account creation status

        if(accountCreated){
            return res.sendStatus(201).send({message: "Account created successfully", user_id: req.body.email});
        }   else {
            return res.sendStatus(500).send({error: "Server error: Account not created"});
        }
    }
};


const login = (req, res) => {
    const { error } = login_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {

        const accountLogin = true; // this is boolean value to placehold the account login status

        if(accountLogin){
            return res.sendStatus(201).send("Account login successfully");
        }   else {
            return res.sendStatus(500).send("Server error: Account not login");
        }
    }
};

const logout = (req, res) => {
    const { error } = logout_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {

        const accountLogout = true; // this is boolean value to placehold the account login status

        if(accountLogout){
            return res.sendStatus(201).send("Account logout successfully");
        }   else {
            return res.sendStatus(500).send("Server error: Account not logout");
        }
    }
};


module.exports = {
    create_account,
    login,
    logout
};
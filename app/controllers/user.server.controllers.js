const require = require("express");
const Joi = require("joi");
const app = require("express");
 

const create_account_validation = Joi.object({
    first_name: Joi.string()
        .alphanum()
        .min(4)
        .max(30)
        .required(),

    last_name: Joi.string()
        .alphanum()
        .min(4)
        .max(30)
        .required(),

    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),

    repeat_password: Joi.ref("password"),

    access_token: [
        Joi.string(),
        Joi.number()
    ]
})

const login_validation = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    
    password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),

    repeat_password: Joi.ref("password"),

    access_token: [
        Joi.string(),
        Joi.number()
    ]
})
 

 // controller main body
const create_account = (req, res) => {
    const { error } = create_account_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    else{
        return res.sendStatus(200).send("Account created successfully");
    }}


const login = (req, res) => {
    const { error } = login_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    else{
        return res.sendStatus(200).send("Login successful");
    }}


const logout = (req, res) => {
    return res.sendStatus(500);
}

module.exports = {
    create_account,
    login,
    logout
}
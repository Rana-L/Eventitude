const require = require("express");
const Joi = require("joi");
const app = require("express");


const event_question_validation = Joi.object({

})

const questions_question_id_validation = Joi.object({

})

const questions_question_id_vote_validation = Joi.object({

})

const questions_question_id_delete_validation = Joi.object({

})





const event_question = (req, res) => {
    const { error } = event_question_validation .validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    else{
        return res.sendStatus(200).send("Event question created successfully");
    }
}

const questions_question_id = (req, res) => {
    const { error } = questions_question_id_validation .validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    else{
        return res.sendStatus(200).send("Event question ID created successfully");
    }
}

const questions_question_id_vote = (req, res) => {
    const { error } = questions_question_id_vote_validation .validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    else{
        return res.sendStatus(200).send("Event question ID vote created successfully");
    }
}

const questions_question_id_delete = (req, res) => {
    const { error } = questions_question_id_deletevalidation .validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    else{
        return res.sendStatus(200).send("Event question ID deleted successfully");
    }
}

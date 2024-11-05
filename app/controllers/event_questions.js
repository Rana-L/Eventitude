const express = require("express");
const Joi = require("joi");
const app = require("express");


const event_question_validation = Joi.object({
    question: Joi.string().min(5).max(100).required(),
    event_id: Joi.number().integer().min(1).required(),
    user_id: Joi.number().integer().min(1).required(),
})

const questions_question_id_delete_validation = Joi.object({
    question_id: Joi.number().integer().min(1).required(),
    event_id: Joi.number().integer().min(1).required(),
})

const questions_question_id_vote_validation = Joi.object({
    question_id: Joi.number().integer().min(1).required(),
    event_id: Joi.number().integer().min(1).required(),
    user_id: Joi.number().integer().min(1).required(),
})

const questions_question_id_vote_delete_validation = Joi.object({
    question_id: Joi.number().integer().min(1).required(),
    event_id: Joi.number().integer().min(1).required(),
    user_id: Joi.number().integer().min(1).required(),
})

// create new event question
const event_question = (req, res) => {
    const isAuthorised = true; // this is boolean value to placehold the authorisation status
    const IsEventOwner = true; // this is boolean value to placehold the event owner status
    if(!isAuthorised){
        return res.sendStatus(401).send("Unauthorised");
    }
    if (!IsEventOwner) {
        return res.status(403).send("Forbidden: You are not the owner of this event");
    }

    const { error } = event_question_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const eventQuestion = true; // this is boolean value to placehold the event search status
        if(eventQuestion){
        return res.sendStatus(201).send("Event question created successfully");
    } else {
        return res.sendStatus(500).send("Server error: Event question not created");
    }
    }  
};

// delete event question
const questions_question_id_delete = (req, res) => {
    const isAuthorised = true; // this is boolean value to placehold the authorisation status
    const IsQuestionOwner = true; // this is boolean value to placehold the event owner status
    const IsQuestionID = true; // this is boolean value to placehold the event owner status
    if(!isAuthorised){
        return res.sendStatus(401).send("Unauthorised");
    }
    if (!IsQuestionOwner) {
        return res.status(403).send("Forbidden: You can only questions that you created");
    }
    if (!IsQuestionID) {
        return res.status(404).send("Question not found");
    }

    const { error } = questions_question_id_delete_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const eventQuestion = true; // this is boolean value to placehold the event search status
        if(eventQuestion){
        return res.sendStatus(201).send("Event question deleted successfully");
    } else {
        return res.sendStatus(500).send("Server error: Event question not deleted");
    }
    }  
};


const questions_question_id_vote = (req, res) => {
    const isAuthorised = true; // this is boolean value to placehold the authorisation status
    const IsQuestionOwner = true; // this is boolean value to placehold the event owner status
    const IsQuestionIDVote = true; // this is boolean value to placehold the event owner status
    if(!isAuthorised){
        return res.sendStatus(401).send("Unauthorised");
    }
    if (!IsQuestionOwner) {
        return res.status(403).send("Forbidden: You have already voted for this question");
    }
    if (!IsQuestionIDVote) {
        return res.status(404).send("Question voting not found");
    }

    const { error } = questions_question_id_vote_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const VoteQuestion = true; // this is boolean value to placehold the event search status
        if(VoteQuestion){
        return res.sendStatus(200).send("Upvoted question successfully");
    } else {
        return res.sendStatus(500).send("Server error: Question not upvoted");
    }
    }  
};


const questions_question_vote_delete = (req, res) => {
    const isAuthorised = true; // this is boolean value to placehold the authorisation status
    const IsQuestionOwner = true; // this is boolean value to placehold the event owner status
    const IsQuestionIDVote = true; // this is boolean value to placehold the event owner status
    if(!isAuthorised){
        return res.sendStatus(401).send("Unauthorised");
    }
    if (!IsQuestionOwner) {
        return res.status(403).send("Forbidden: You have already voted for this question");
    }
    if (!IsQuestionIDVote) {
        return res.status(404).send("Question voting not found");
    }

    const { error } = questions_question_id_vote_delete_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const VoteQuestion = true; // this is boolean value to placehold the event search status
        if(VoteQuestion){
        return res.sendStatus(200).send("Downvoted question successfully");
    } else {
        return res.sendStatus(500).send("Server error: Question not downvoted");
    }
    }  
};

module.exports = {
    event_question,
    questions_question_id_delete,
    questions_question_id_vote,
    questions_question_vote_delete
};
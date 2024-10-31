const require = require("express");
const Joi = require("joi");
const app = require("express");

const create_events_validation = Joi.object({
    name: Joi.string().alphanum().min(4).max(30).required(),
    description: Joi.string().min(4).max(100).required(),
    location: Joi.string().min(4).max(30).required(),
    start: Joi.number().integer().min(1).required(),
    close_registration: Joi.number().integer().required().less(Joi.ref('start')), // close registration must be before start date
    max_attendees: Joi.number().integer().min(1).required(),
})

const event_id_validation = Joi.object({
    event_id: Joi.number().integer().min(1).required(),
})

const event_update_validation = Joi.object({
    name: Joi.string().alphanum().min(4).max(30).required(),
    description: Joi.string().min(4).max(100).required(),
    location: Joi.string().min(4).max(30).required(),
    start: Joi.number().integer().min(1).required(),
    close_registration: Joi.number().integer().required().less(Joi.ref('start')), // close registration must be before start date
    max_attendees: Joi.number().integer().min(1).required(),
})

const event_attendee_validation = Joi.object({
    attendee_id: Joi.number().integer().min(1).required(),
    event_id: Joi.number().integer().min(1).required(),
})

const event_delete_validation = Joi.object({
    event_id: Joi.number().integer().min(1).required(),
})

const event_search_validation = Joi.object({
    q: Joi.string().min(4).max(30).required(), 
    status: Joi.string().keys("MY_EVENTS, ATTENDING, OPEN, ARCHIVE").required(),
    limit: Joi.number().integer().min(1).max(20).required(),
    offset: Joi.number().integer().min(0).required()
})



// create new event
const create_events = (req, res) => {
    const { error } = create_events_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    else{
        return res.sendStatus(200).send("Event created successfully");
    }
}



// get single events details
const event_id = (req, res) => {
    const { error } = event_id_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    else{
        return res.sendStatus(200).send("Event ID created successfully");
    }
}


// Update event 
const event_update = (req, res) => {
    const { error } = event_update_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    else{
        return res.sendStatus(200).send("Event updated successfully");
    }
    
}

// Register to attend for an event
const event_attend = (req, res) => {
    const { error } = event_attendee_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    else{
        return res.sendStatus(200).send("Event attendee created successfully");
    }
}

// Delete an event
const event_delete = (req, res) => {
    const { error } = event_delete_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    else{
        return res.sendStatus(200).send("Event deleted successfully");
    }   
}

// Search for an event
const event_search = (req, res) => {
    const { error } = event_search_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    else{
        return res.sendStatus(200).send("Event found");
    }  
}

module.exports = {
    create_events,
    event_id,
    event_update,
    event_attend,
    event_delete,
    event_search
}
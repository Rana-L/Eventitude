const express = require("express");
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
    status: Joi.string().valid("MY_EVENTS, ATTENDING, OPEN, ARCHIVE").required(),
    limit: Joi.number().integer().min(1).max(20).required(),
    offset: Joi.number().integer().min(0).required()
})



// create new event
const create_events = (req, res) => {
    isAuthorised = true; // this is boolean value to placehold the authorisation status
    if(!isAuthorised){
        return res.sendStatus(401).send("Unauthorised");
    }

    const { error } = create_events_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const eventCreated = true; // this is boolean value to placehold the event creation status

        if(eventCreated){
            return res.sendStatus(201).send("Event created successfully");
        } else {
            return res.sendStatus(500).send("Server error: Event not created");
        }
    }
};


// get single events details
const event_id = (req, res) => {
    const { error } = event_id_validation.validate(req.body);
    if (error) {
        return res.status(404).send(error.details[0].message);
    } else {
        const eventID = true; // this is boolean value to placehold the event ID status

        if(eventID){
            return res.sendStatus(200).send("Event ID found successfully");
        } else {
            return res.sendStatus(500).send("Server error: Event ID not found");
        }
    }
};


// Update event 
const event_update = (req, res) => {
   const isAuthorised = true; // this is boolean value to placehold the authorisation status
   const eventID = true;
   const IsEventOwner = true;


    if(!isAuthorised){
        return res.sendStatus(401).send("Unauthorised");
    }
    if (!eventID) {
        return res.status(404).send("Event not found");
    }
    if (!IsEventOwner) {
        return res.status(403).send("Forbidden: You can only update your own events");
    }

    const { error } = event_update_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const eventUpdated = true; // this is boolean value to placehold the event update status
        if(eventUpdated){
            return res.sendStatus(200).send("Event updated successfully");
        } else {
            return res.sendStatus(500).send("Server error: Event not updated");
        }
    }
};

// Register to attend for an event
const event_attend = (req, res) => {
    const isAuthorised = true; // this is boolean value to placehold the authorisation status
    const attendeeID = true;
    const IsRegistrationOpen = false;


    if(!isAuthorised){
        return res.sendStatus(401).send("Unauthorised");
    }
    if (!attendeeID) {
        return res.status(404).send("Attendee not found");
    }
    if (!IsRegistrationOpen) {
        return res.status(403).send("Forbidden: Registeration is closed");
    }

    const { error } = event_attendee_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const eventAttendee = true; // this is boolean value to placehold the event attendee status
        if(eventAttendee){
            return res.sendStatus(200).send("Attendee created successfully");
        } else {
            return res.sendStatus(500).send("Server error: Attendee not created");
        }
    }
};


// Delete an event
const event_delete = (req, res) => {
    const isAuthorised = true; // this is boolean value to placehold the authorisation status
    const eventID = true;
    const IsEventOwner = true;
    if(!isAuthorised){
        return res.sendStatus(401).send("Unauthorised");
    }
    if (!eventID) {
        return res.status(404).send("Event not found");
    }
    if (!IsEventOwner) {
        return res.status(403).send("Forbidden: You can only delete your own events");
    }

    const { error } = event_delete_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const eventDelete = true; // this is boolean value to placehold the event deleted status
        if(eventDelete){
            return res.sendStatus(200).send("Event deleted successfully");
        } else {
            return res.sendStatus(500).send("Server error: Event not deleted");
        }
    }
};
  
// Search for an event
const event_search = (req, res) => {
    const { error } = event_search_validation.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const eventFound = true; // this is boolean value to placehold the event search status
        if(eventFound){
        return res.sendStatus(200).send("Event found");
    } else {
        return res.sendStatus(500).send("Server error: Event not found");
    }
    }  
};

module.exports = {
    create_events,
    event_id,
    event_update,
    event_attend,
    event_delete,
    event_search
};
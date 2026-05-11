const Joi = require("joi");
const app = require("express");
const events = require("../models/events.js");

// create new event
const create_events = (req, res) => {
  let schema = Joi.object({
    name: Joi.string().min(4).max(30).required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    start: Joi.number().min(1).required(),
    close_registration: Joi.number().greater(0).required(),
    max_attendees: Joi.number().integer().min(1).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error_message: error.details[0].message });
  }

  let date = Date.now();

  if (req.body.start <= date) {
    return res
      .status(400)
      .json({ error_message: "Event start time must be in the future" });
  }

  if (req.body.start <= req.body.close_registration) {
    return res.status(400).json({
      error_message: "Registration closing must be before start date",
    });
  }

  const eventData = {
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    start_date: req.body.start_date,
    close_registration: req.body.close_registration,
    max_attendees: req.body.max_attendees,
    creator_id: req.user_id,
  };

  events.newEvent(eventData, req.user_id, (err, id) => {
    if (err) {
      return res.status(500).send({ error_message: "Error creating event" });
    } else {
      return res.status(201).json({
        message: "Event created successfully",
        event_id: id,
      });
    }
  });
};

// get single events details
const get_events = (req, res) => {
  const { event_id } = req.params;

  if (!event_id || isNaN(event_id)) {
    return res.status(400).json({ error_message: "Invalid event ID" });
  }

  const parsed_event_id = parseInt(event_id, 10);

  events.getEventDetails(parsed_event_id, req.user_id, (err, result) => {
    if (err === 404) {
      return res.status(404).json({ error_message: "Event not found" });
    }
    if (err) {
      return res.status(500).json({ error_message: "Error getting event" });
    }
    return res.status(200).json(result);
  });
};

let event_update_validation = Joi.object({
  name: Joi.string().min(4).max(30).optional(),
  description: Joi.string().optional(),
  location: Joi.string().optional(),
  start_date: Joi.number().greater(Date.now()).min(1).optional(),
  close_registration: Joi.number().greater(0).optional(),
  max_attendees: Joi.number().integer().min(1).optional(),
});

// Update event
const event_update = (req, res) => {
  if (!req.user_id) {
    return res.status(401).json({ error_message: "Unauthorized" });
  }

  const { error } = event_update_validation.validate(req.body);
  if (error) {
    return res.status(400).json({ error_message: error.details[0].message });
  }

  const eventId = req.params.event_id;

  events.getEventDetails(eventId, req.user_id, (err, Event) => {
    if (err === 404) {
      return res.status(404).json({ error_message: "Event not found" });
    }
    if (err) {
      console.error("Error fetching event details:", err);
      return res.status(500).json({ error_message: "Error fetching event" });
    }
    if (!Event) {
      return res.status(404).json({ error_message: "Event not found" });
    }

    if (Event.creator.user_id !== req.user_id) {
      return res
        .status(403)
        .json({ error_message: "You can only update your own events" });
    }

    events.update({ ...req.body, event_id: eventId }, (err) => {
      if (err) {
        console.error("Error updating event:", err);
        return res.status(500).json({ error_message: "Error updating event" });
      }
      return res.status(200).json({ message: "Event updated successfully" });
    });
  });
};

const event_attendee_validation = Joi.object({
  event_id: Joi.number().integer().min(1).required(),
});

// Register to attend for an event
const event_attend = (req, res) => {
  const eventId = parseInt(req.params.event_id);
  const userId = req.user_id;

  // Validate the event_id
  const { error } = event_attendee_validation.validate({ event_id: eventId });
  if (error) {
    return res.status(400).json({ error_message: error.details[0].message });
  }

  if (!userId) {
    return res
      .status(401)
      .json({ error_message: "Unauthorized: User ID is required" });
  }

  // Check if the event exists and user is allowed to attend
  events.attend(eventId, userId, (err, result) => {
    if (err) {
      switch (err.message) {
        case "ALREADY_REGISTERED":
          return res
            .status(403)
            .json({ error_message: "You are already registered" });
        case "USER_IS_CREATOR":
          return res
            .status(403)
            .json({ error_message: "You cannot register for your own event" });
        case "REGISTRATION_CLOSED":
          return res
            .status(403)
            .json({ error_message: "Registration is closed" });
        case "EVENT_NOT_FOUND":
          return res.status(404).json({ error_message: "Event not found" });
        case "EVENT_AT_CAPACITY":
          return res
            .status(403)
            .json({ error_message: "Event is at capacity" });
        default:
          return res
            .status(500)
            .json({ error_message: "Internal server error" });
      }
    }
    return res.status(200).json({ message: "Attending event successfully" });
  });
};

const event_delete_validation = Joi.object({
  event_id: Joi.number().min(1).required(),
});

// Delete an event
const event_delete = (req, res) => {
  if (!req.user_id) {
    return res
      .status(401)
      .json({ error_message: "Unauthorized: User not authenticated" });
  }

  const { error } = event_delete_validation.validate({
    event_id: parseInt(req.params.event_id, 10),
  });
  if (error) {
    return res.status(400).json({ error_message: error.details[0].message });
  }

  const eventId = parseInt(req.params.event_id, 10);
  const userId = req.user_id;

  events.getEventDetails(eventId, userId, (err, Event) => {
    if (err === 404) {
      return res.status(404).json({ error_message: "Event not found" });
    }
    if (err) {
      console.error("Error fetching event:", err);
      return res.status(500).json({ error_message: "Error fetching event" });
    }

    if (!Event) {
      console.error("Event not found for ID:", eventId);
      return res.status(404).json({ error_message: "Event not found" });
    }

    if (Event.creator.user_id !== userId) {
      return res
        .status(403)
        .json({ error_message: "You can only delete your own events" });
    }

    if (Event.close_registration === -1) {
      return res.status(200).json({ message: "Event is already archived" });
    }

    events.deleteEvent({ event_id: eventId }, (updateError) => {
      if (updateError) {
        console.error("Error archiving event:", updateError);
        return res.status(500).json({ error_message: "Error archiving event" });
      }
      return res.status(200).json({ message: "Event successfully archived" });
    });
  });
};

const event_search_validation = Joi.object({
  q: Joi.string().min(4).max(30).optional(),
  status: Joi.string()
    .valid("MY_EVENTS", "ATTENDING", "OPEN", "ARCHIVE")
    .required(),
  limit: Joi.number().min(1).max(100).optional(),
  offset: Joi.number().min(0).optional(),
});

// Search for an event
const event_search = (req, res) => {
  const { error } = event_search_validation.validate(req.body || {});
  if (error) {
    console.error("Validation Error:", error.details);
    return res.status(400).json({ error_message: error.details[0].message });
  }

  const { q = "", status = "OPEN", limit = 20, offset = 0 } = req.query;

  const user = req.user_id;
  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  const filter = {
    q,
    status,
    limit,
    offset,
    userId: status === "MY_EVENTS" ? user : null,
  };

  events.searchEvents(filter, (err, events) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).send("Error searching events");
    }

    return res.status(200).json(events);
  });
};

module.exports = {
  create_events,
  get_events,
  event_update,
  event_attend,
  event_delete,
  event_search,
};

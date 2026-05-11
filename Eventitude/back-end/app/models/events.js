const db = require("../../database.js");

const newEvent = (event, user_id, done) => {
  const sql =
    "INSERT INTO events (name, description, location, start_date, close_registration, max_attendees, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
  let values = [
    event.name,
    event.description,
    event.location,
    event.start_date,
    event.close_registration,
    event.max_attendees,
    event.creator_id,
  ];

  db.run(sql, values, function (err) {
    if (err) {
      return done(err);
    }
    return done(null, this.lastID);
  });
};

const getEventDetails = (event_id, logged_in_user_id, done) => {
  const sql =
    "SELECT events.*, users.first_name, users.last_name, users.email FROM events JOIN users ON events.creator_id = users.user_id WHERE event_id = ?";

  db.get(sql, [event_id], (err, event_details) => {
    if (err) {
      console.error("SQL Error:", err);
      return done(err);
    }

    if (!event_details) {
      return done(404);
    }

    let num_rows = 0;
    let attendees_list = [];

    const attendeesSql =
      "SELECT users.user_id, users.first_name, users.last_name FROM attendees JOIN users ON attendees.user_id = users.user_id WHERE attendees.event_id = ?";

    db.all(attendeesSql, [event_id], (err, attendees) => {
      if (err) {
        console.error("SQL Error:", err);
        return done(err);
      }

      num_rows = attendees.length;

      attendees_list = attendees.map((attendee) => {
        return {
          user_id: attendee.user_id,
          first_name: attendee.first_name,
          last_name: attendee.last_name,
        };
      });

      let to_return = {
        event_id: event_details.event_id,
        creator: {
          user_id: event_details.creator_id,
          first_name: event_details.first_name,
          last_name: event_details.last_name,
          email: event_details.email,
        },
        name: event_details.name,
        description: event_details.description,
        location: event_details.location,
        start: event_details.start_date,
        close_registration: event_details.close_registration,
        max_attendees: event_details.max_attendees,
      };

      to_return["number_attending"] = num_rows + 1;

      if (logged_in_user_id && logged_in_user_id === event_details.creator_id) {
        to_return["attendees"] = attendees_list;
      }
      return done(null, to_return);
    });
  });
};

const update = (event, done) => {
  const sql =
    "UPDATE events SET name = ?, description = ?, location = ?, start_date = ?, close_registration = ?, max_attendees = ? WHERE event_id = ?";
  let values = [
    event.name,
    event.description,
    event.location,
    event.start_date,
    event.close_registration,
    event.max_attendees,
    event.event_id,
  ];

  db.run(sql, values, function (err) {
    if (err) {
      return done(err);
    }

    if (this.changes === 0) {
      return done(new Error("No event found or no changes made"));
    }

    return done(null, { event_id: event.event_id });
  });
};

const deleteEvent = (event, done) => {
  const sql = "UPDATE events SET close_registration = -1 WHERE event_id = ?";

  db.run(sql, [event.event_id], function (err) {
    if (err) {
      return done(err);
    }

    if (this.changes === 0) {
      return done(new Error("No rows updated"));
    }
    return done(null);
  });
};

const checkIfAttendeeExists = (event_id, user_id, done) => {
  const sql =
    "SELECT COUNT(*) AS count FROM attendees WHERE event_id = ? AND user_id = ?";

  db.get(sql, [event_id, user_id], (err, row) => {
    if (err) {
      return done(err, null);
    }
    return done(null, row.count > 0);
  });
};

const attend = (event_id, user_id, done) => {
  getEventDetails(event_id, user_id, (err, event) => {
    if (err) {
      return done(err);
    }

    if (!event) {
      return done(new Error("EVENT_NOT_FOUND"));
    }

    if (event.creator.user_id === user_id) {
      return done(new Error("USER_IS_CREATOR"));
    }

    if (event.close_registration <= Date.now()) {
      return done(new Error("REGISTRATION_CLOSED"));
    }

    if (event.number_attending >= event.max_attendees) {
      return done(new Error("EVENT_AT_CAPACITY"));
    }

    checkIfAttendeeExists(event_id, user_id, (err, exists) => {
      if (err) {
        return done(err);
      }

      if (exists) {
        return done(new Error("ALREADY_REGISTERED"));
      }

      const sql = "INSERT INTO attendees (event_id, user_id) VALUES (?, ?)";
      db.run(sql, [event_id, user_id], function (err) {
        if (err) {
          return done(err);
        }
        return done(null, { event_id, user_id });
      });
    });
  });
};

const query = (event, done) => {
  let sql = "SELECT * FROM events WHERE 1=1";
  const params = [];

  if (event.query) {
    sql += " AND (name LIKE ? OR description LIKE ? OR location LIKE ?)";
    const searchQuery = `%${event.query}%`;
    params.push(searchQuery, searchQuery, searchQuery);
  }

  if (event.name) {
    sql += " AND name = ?";
    params.push(event.name);
  }
  if (event.location) {
    sql += " AND location = ?";
    params.push(event.location);
  }
  if (event.start_date) {
    sql += " AND start_date = ?";
    params.push(event.start_date);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return done(err);
    }
    return done(null, rows || []);
  });
};

module.exports = {
  newEvent,
  getEventDetails,
  update,
  deleteEvent,
  attend,
  checkIfAttendeeExists,
  query,
};

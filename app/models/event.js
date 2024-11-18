const db = require('../../database.js');

const include = (event, done) => {
    const sql = 'INSERT INTO events (name, description, location, start_date, close_registration, max_attendees, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    let values = [event.name, event.description, event.location, event.start_date, event.close_registration, event.max_attendees, event.creator_id];

    db.run(sql, values, function(err) {
        if (err) {
            return done(err);
        }
        return done(null, row);
    }
    );
}

const select = (event, done) => {

    const sql = 'SELECT * FROM events WHERE event_id = ?';
    db.get(sql, [event.event_id], (err, row) => {
        if (err) {
            return done(err);
        }
        return done(null, row);
    });
}

const update = (event, done) => {
    const sql = 'UPDATE events SET name = ?, description = ?, location = ?, start_date = ?, close_registration = ?, max_attendees = ? WHERE event_id = ?';
    let values = [event.name, event.description, event.location, event.start_date, event.close_registration, event.max_attendees, event.event_id];

    db.run(sql, values, function(err) {
        if (err) {
            return done(err);
        }
        return done(null,row );
    });
}

const remove = (event, done) => {
    const sql = 'DELETE events SET close_registration = -1 WHERE event_id = ?';
    
    db.run(sql, [event.event_id, event.close_registration], (err, row) => {
        if (err) {
            return done(err);
        }
        return done(null, row);
    });
}

const attend = (event, done) => {
    const sql = 'INSERT events INTO attendees (event_id, user_id) VALUES (?,?)';

  
    db.run(sql, [event.event_id, event.user_id], (err, row) => {
        if (err) {
            return done(err);
        }
        return done(null, row);
    });
}


const query = (event, done) => {

    let sql = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (event.query) {
        sql += ' AND (name LIKE ? OR description LIKE ? OR location LIKE ?)';
        const searchQuery = '%${event.query}%';
        params.push(searchQuery, searchQuery, searchQuery);
    }

    if (event.name) {
        sql += ' AND name = ?';
        params.push(event.name);
    }
    if (event.location) {
        sql += ' AND location = ?';
        params.push(event.location);
    }
    if (event.start_date) {
        sql += ' AND start_date = ?';
        params.push(event.start_date);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return done(err);
        }
        return done(null, rows);
    });
}

module.exports = {
    include,
    select,
    update,
    remove,
    attend,
    query
};

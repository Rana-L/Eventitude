const db = require('../../database.js');

const include = (Q, done) => {
    const sql = 'INSERT INTO event_questions (question, asked_by, event_id, votes) VALUES (?, ?, ?, ?)';
    let values = [Q.question, Q.asked_by, Q.event_id, Q.votes];

    db.run(sql, values, function(err) {
        if (err) {
            return done(err);
        }
        return done(null, row);
    });
}

const delete_question = (Q, done) => {
    const sql = 'DELETE FROM event_questions WHERE question_id = ?';
    let values = [Q.question_id];

    db.run(sql, values, function(err) {
        if (err) {
            return done(err);
        }
        return done(null, row);
    });
}

const update_vote = (Q, done) => {
    const sql = 'UPDATE event_questions SET votes =  votes + 1 WHERE question_id = ?';
    let values = [Q.votes, Q.question_id];

    db.run(sql, values, function(err) {
        if (err) {
            return done(err);
        }
        return done(null, row);
    });
}

const update_unvote = (Q, done) => {
    const sql = 'UPDATE event_questions SET votes =  votes - 1 WHERE question_id = ?';
    let values = [Q.votes, Q.question_id];

    db.run(sql, values, function(err) {
        if (err) {
            return done(err);
        }
        return done(null, row);
    });
}

module.exports = {
    include,
    delete_question,
    update_vote,
    update_unvote
};

  






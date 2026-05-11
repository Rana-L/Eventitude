const db = require("../../database.js");

const checkUserRegistrationForEvent = (userId, eventId, done) => {
  console.log("Checking registration for user:", userId, "for event:", eventId);

  const sql = `
    SELECT COUNT(*) as count 
    FROM attendees 
    WHERE user_id = ? AND event_id = ?
  `;

  let values = [userId, eventId];

  db.get(sql, values, (err, row) => {
    if (err) {
      console.error("SQL Error:", err); // Log the SQL error
      return done(err);
    }

    // Check if the user is the creator of the event or has asked a question for that event
    const isRegistered = row.count > 0;

    return done(null, isRegistered);
  });
};

const newQuestion = (question, done) => {
  const sql =
    "INSERT INTO questions (question, asked_by,  event_id, votes) VALUES (?, ?, ?, ?)";

  let values = [
    question.question,
    question.asked_by,
    question.event_id,
    question.votes,
  ];

  db.run(sql, values, function (err) {
    if (err) {
      return done(err);
    }
    return done(null, this.lastID);
  });
};

const getQuestionById = (question_id, done) => {
  const sql = "SELECT * FROM questions WHERE question_id = ?";

  let values = [question_id];

  db.get(sql, values, (err, row) => {
    if (err) {
      return done(err);
    }
    return done(null, row);
  });
};

const deleteQuestion = (question_id, done) => {
  const sql = "DELETE FROM questions WHERE question_id = ?";

  let values = [question_id];

  db.run(sql, values, function (err) {
    if (err) {
      return done(err);
    }
    return done(null);
  });
};

const update_vote = (question_id, done) => {
  const sql = "UPDATE questions SET votes = votes + 1 WHERE question_id = ?";

  let values = [question_id];

  db.run(sql, values, function (err) {
    if (err) {
      return done(err);
    }
    return done(null);
  });
};

const update_unvote = (question_id, done) => {
  const sql = "UPDATE questions SET votes = votes - 1 WHERE question_id = ?";

  let values = [question_id];

  db.run(sql, values, function (err) {
    if (err) {
      return done(err);
    }
    return done(null);
  });
};

const fetchQuestionsByEventId = (event_id, done) => {
  const sql = "SELECT * FROM questions WHERE event_id = ?";

  let values = [event_id];

  db.all(sql, values, (err, rows) => {
    if (err) {
      return done(err);
    }
    return done(null, rows);
  });
};

module.exports = {
  newQuestion,
  deleteQuestion,
  update_vote,
  update_unvote,
  fetchQuestionsByEventId,
  getQuestionById,
  checkUserRegistrationForEvent,
};


const eventQuestions = require("../controllers/event_questions.js")

module.exports = function(app){
    app.route("/events/:event_id/questions")
        .post(eventQuestions);

    app.route("/questions/:question_id")
        .delete(eventQuestions);

    app.route("/questions/:question_id/vote")
        .post(eventQuestions);

    app.route("/questions/:question_id/vote")
        .delete(eventQuestions);
}
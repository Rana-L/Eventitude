const {isAuthenticated} = require("../libs/middleware.js");
const eventQuestions = require("../controllers/event_questions.js")

module.exports = function(app){
    app.route("/events/:event_id/questions")
        .post(isAuthenticated, eventQuestions);

    app.route("/questions/:question_id")
        .delete(isAuthenticated, eventQuestions);

    app.route("/questions/:question_id/vote")
        .post(isAuthenticated, eventQuestions);

    app.route("/questions/:question_id/vote")
        .delete(isAuthenticated, eventQuestions);
}
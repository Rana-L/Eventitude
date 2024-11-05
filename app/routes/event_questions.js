const {isAuthenticated} = require("../libs/middleware.js");
const eventQuestions = require("../controllers/event_questions.js")

module.exports = function(app){
    app.route("/events/:event_id/questions")
        .post(isAuthenticated, eventQuestions.event_question);

    app.route("/questions/:question_id")
        .delete(isAuthenticated, eventQuestions.questions_question_id_delete);

    app.route("/questions/:question_id/vote")
        .post(isAuthenticated, eventQuestions.questions_question_id_vote);

    app.route("/questions/:question_id/vote")
        .delete(isAuthenticated, eventQuestions.questions_question_vote_delete);
}
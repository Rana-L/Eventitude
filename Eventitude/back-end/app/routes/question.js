const { isAuthenticated } = require("../libs/middleware.js");
const question = require("../controllers/question.js");

module.exports = function (app) {
  app
    .route("/event/:event_id/question")
    .post(isAuthenticated, question.create_question);

  app
    .route("/question/:question_id")
    .delete(isAuthenticated, question.delete_question);

  app
    .route("/question/:question_id/vote")
    .post(isAuthenticated, question.upvote_question);

  app
    .route("/question/:question_id/vote")
    .delete(isAuthenticated, question.downvote_question);
};

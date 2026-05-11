const Joi = require("joi");
const app = require("express");
const question = require("../models/question.js");

// Validation schema for creating a question
const create_question_validation = Joi.object({
  event_id: Joi.number().integer().optional(),
  question: Joi.string().optional(),
});

// Create a question
const create_question = (req, res) => {
  const eventId = req.params.event_id;
  const questionText = req.body.question;

  // Step 1: Validate question first
  const { error } = create_question_validation.validate({
    event_id: eventId,
    question: questionText,
  });
  if (error) {
    return res.status(400).json({ error_message: error.details[0].message });
  }

  // Step 2: Check if user is authorized to ask questions for this event
  if (!req.user_id) {
    return res.status(401).json({ error_message: "Unauthorized request" });
  }

  // Check if user is registered for the event
  question.checkUserRegistrationForEvent(
    req.user_id,
    eventId,
    (err, isRegistered) => {
      if (err) {
        console.error("Error checking registration:", err);
        return res
          .status(500)
          .json({ error_message: "Error checking registration" });
      }

      if (!isRegistered) {
        return res.status(403).json({
          error_message:
            "You cannot ask questions on events you are not registered for",
        });
      }

      // Step 3: Proceed to create the question
      question.newQuestion(
        {
          question: questionText,
          asked_by: req.user_id,
          event_id: eventId,
          votes: 0,
        },
        (err, id) => {
          if (err) {
            console.error("Error creating question in database:", err);
            return res
              .status(500)
              .json({ error_message: "Error creating question" });
          } else {
            console.log("Question created successfully with ID:", id);
            return res.status(201).json({
              message: "Question created successfully",
              question_id: id,
            });
          }
        }
      );
    }
  );
};

const delete_question_validation = Joi.object({
  question_id: Joi.number().required(),
});

const delete_question = (req, res) => {
  if (!req.user_id) {
    return res.status(401).json({ error_message: "Unauthorized request" });
  }

  const { error } = delete_question_validation.validate(req.params);
  if (error) {
    return res.status(400).json({ error_message: error.details[0].message });
  }

  // Fetch the question details by ID
  question.getQuestionById(req.params.question_id, (err, foundQuestion) => {
    if (err) {
      return res
        .status(500)
        .json({ error_message: "Error retrieving question" });
    }

    if (!foundQuestion) {
      return res.status(404).json({ error_message: "Question not found" });
    }

    // Check if the user is authorized to delete the question
    const isAuthor = foundQuestion.asked_by === req.user_id;
    const isEventCreator = foundQuestion.event_creator === req.user_id;

    if (!isAuthor && !isEventCreator) {
      return res.status(403).json({
        error_message:
          "You can only delete questions that you have authored, or for events that you have created",
      });
    }

    // Proceed to delete the question
    question.deleteQuestion(req.params.question_id, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error_message: "Error deleting question" });
      }

      return res.status(200).json({ message: "Question deleted successfully" });
    });
  });
};

const upvote_question_validation = Joi.object({
  question_id: Joi.number().required(),
});

const upvote_question = (req, res) => {
  if (!req.user_id) {
    return res.status(401).json({ error_message: "Unauthorized request" });
  }

  const { question_id } = req.params;
  const { error } = upvote_question_validation.validate({ question_id });

  if (error) {
    return res.status(400).json({ error_message: error.details[0].message });
  }

  const canVoteOnQuestion = (user, question_id) => {
    console.log("Validating if user can vote:", user, question_id);
  };

  if (!canVoteOnQuestion(req.user_id, question_id)) {
    return res.status(403).json({
      error_message: "You have already voted on this question",
    });
  }

  question.getQuestionById(question_id, (err, question) => {
    if (err) {
      console.error("Error retrieving question:", err); // Log the error
      return res
        .status(500)
        .send({ error_message: "Error retrieving question" });
    }
    if (!question) {
      return res.status(404).json({ error_message: "Question not found" });
    }

    question.update_vote(question_id, (err) => {
      if (err) {
        console.error("Error updating vote:", err); // Log the error
        return res
          .status(500)
          .send({ error_message: "Error upvoting question" });
      } else {
        return res
          .status(200)
          .json({ message: "Question upvoted successfully" });
      }
    });
  });
};

const downvote_question_validation = Joi.object({
  question_id: Joi.number().integer().required(),
});

const downvote_question = (req, res) => {
  const { error } = downvote_question_validation.validate(req.params);
  if (error) {
    return res.status(400).json({ error_message: error.details[0].message });
  }

  question.update_unvote(req.params.question_id, (err) => {
    if (err) {
      return res
        .status(500)
        .send({ error_message: "Error downvoting question" });
    } else {
      return res
        .status(200)
        .json({ message: "Question downvoted successfully" });
    }
  });
};

module.exports = {
  create_question,
  delete_question,
  upvote_question,
  downvote_question,
};

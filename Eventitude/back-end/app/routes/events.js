const { isAuthenticated } = require("../libs/middleware.js");
const event = require("../controllers/events.js");

module.exports = function (app) {
  app.route("/events").post(isAuthenticated, event.create_events);

  app.route("/event/:event_id").get(event.get_events);

  app.route("/event/:event_id").patch(isAuthenticated, event.event_update);

  app.route("/event/:event_id").post(isAuthenticated, event.event_attend);

  app.route("/event/:event_id").delete(isAuthenticated, event.event_delete);

  app.route("/search").get(event.event_search);
};

const {isAuthenticated} = require("../libs/middleware.js");
const event = require("../controllers/event.js")

module.exports = function(app){
    app.route("/events")
        .post(isAuthenticated, event.create_events);

    app.route("events/:event_id")
        .get(isAuthenticated, event.event_id);

    app.route("events/:event_id")
        .patch(isAuthenticated, event.event_update);

    app.route("events/:event_id/attendees/:attendee_id")
        .post(isAuthenticated, event.event_attend);
    
    app.route("events/:event_id")
        .delete(isAuthenticated, event.event_delete);
    
    app.route("/search")
        .get(event.event_search);   
}
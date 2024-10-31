
const event = require("../controllers/event.js")

module.exports = function(app){
    app.route("/events")
        .post(event.create_events);

    app.route("events/:event_id")
        .get(event.event_id);

    app.route("events/:event_id")
        .patch(event.event_update);

    app.route("events/:event_id/attendees/:attendee_id")
        .post(event.event_attendee);
    
    app.route("events/:event_id")
        .delete(event.event_delete);
    
    app.route("/search")
        .get(event.event_search);   
}
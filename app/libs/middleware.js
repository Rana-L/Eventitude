const users = require("../models/users.js")

const isAuthenticated = function(req, res, next) {
    let token = req.get('X-Authorization');

    users.getIdFromToken(token, (err, id) => {
        if (err || id === null) {
            return res.sendStatus(401).send("Unauthorized");
        }
        if (!user_id) {
            return res.status(401).json({ message: "User must be logged in" });
        }
        req.user_id = id;
        next();
    });
};

module.exports = { 
    isAuthenticated 
};

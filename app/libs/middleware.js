
const sql = 'SELECT user_id FROM users WHERE session_token = ?';
const params = [token];

const isAuthenticated = function(req, res, next) {
    let token = req.get('X-Authorization');

    users.getIdFromToken(token, (err, id) => {
        if (err || id === null) {
            return res.sendStatus(401);
        }
        next();
    });
};

export {isAuthenticated};



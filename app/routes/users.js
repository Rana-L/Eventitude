// The routes top art of endpoint
const users = require("../controllers/users.js")


module.exports = function(app){
    app.route("/users")
        .post(users.create_account);

    app.route("/login")
        .post(users.login);

    app.route("/logout")
        .post(users.logout);

}
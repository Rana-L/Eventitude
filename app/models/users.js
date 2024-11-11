const crypto = require('crypto');
const db = require('../../database.js');


// create an account
const NewUser = (user, done) => {
  const salt = crypto.randomBytes(64);
  const hash = getHash(user.password, salt);
 
  const checkEmail = 'SELECT email FROM users WHERE email = ?';
  const sql = 'INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?, ?, ?, ?, ?)';
  let values = [user.first_name, user.last_name, user.email, hash, salt.toString('hex')];

  db.get(checkEmail, [user.email], (err, row) => {
    if (err) {
      return done(err);
    }
    if (row) {
      return done (new Error('Email already exists'));
    }
  })

  db.run(sql, values, function(err) {
    if (err) {
      return done(err);
    }
    return done(null, this.lastID);
  });
};

const getHash = function(password, salt){
  return crypto.pbkdf2Sync(password, salt, 10000, 256, 'sha256').toString('hex');
}

// Logging in
const authenticateUser = (email, password, done) => {
  const sql = 'SELECT user_id, password, salt FROM users WHERE email = ?';

  db.get(sql, [email], (err, row) => {
    if(err) return done(err)
    if(!row) return done(404) // wrong email

    if(row.salt === null) row.salt = '';

    let salt = Buffer.from(row.salt, 'hex')

    if(row.password === getHash(password, salt)){
      return done(false, row.user_id)
    }else{
      return done(404) // wrong password
    }
  })
}



  // setting token
const setToken = (id, done) => {
  let token = crypto.randomBytes(16).toString('hex');
  const sql = 'UPDATE users SET session_token=? WHERE user_id=?';

  db.run(sql, [token, id], (err) => {
    return done(err, token);
  })
}

// Logging out
const removeToken = (token, done) => {
  const sql = "UPDATE users SET session_token=null WHERE session_token=?";

  db.run(sql, [token], (err) => {
    return done(err);
  })
}


module.exports = {
  NewUser,
  authenticateUser,
  setToken,
  removeToken,
}




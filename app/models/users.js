

// create an account
const addNewUser = (user, done) => {
  const salt = crypto.randomBytes(64);
  const hash = getHash(user.password, salt);

  const sql = 'INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?, ?, ?, ?, ?)';
  let values = [user.first_name, user.last_name, user.email, hash, salt.toString('hex')];

  db.run(sql, values, function(err) {
    if (err) {
      return done(err);
    }
    return done(null, this.lastID);
  });

  const getHash = function(password, salt){
    return crypto.pbkdf2Sync(password, salt, 10000, 256, 'sha256').toString('hex');
  }
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

users.authenticateUser(req.body.email, req.body.password, (err, id) => {
  if(err === 404) return res.status(400).send("Invalid email/password supplied")
  if (err) return res.sendStatus(500)
    
    users.getToken(id, (err, token) => {
      if (err) return res.sendStatus(500)

      if(token){
        return res.status(200).send({user_id: id, session_token: token})
      }else{
        users.setToken(id, (err, token) => {
          if (err) return res.sendStatus(500)
          return res.status(200).send({user_id: id, session_token: token})
        })
      }
    })
  })

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
/* jshint esversion: 6 */
/* jshint node: true */

'use strict';
const checker = require('./checkinputs.js');
const capt = require('./capitalizer.js');
const imgManager = require('./imgManager.js');

const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const emailValidator = require('email-validator');
const session = require('express-session');
const multer = require('multer');

// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

require('dotenv').config();

// MySQL connection
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

// Multer Storage
const storage = multer.diskStorage({
  destination: './public/profile_images/',
  filename: (req, file, callback) => {

    imgManager.update('./public/profile_images', req.session.userId, () => {
      callback(null, req.session.userId + path.extname(file.originalname));
    });
  }
});

// Multer Upload
const upload = multer({
  storage: storage,
  limits: {fileSize: 8000000},
  fileFilter: (req, file, cb) => {
    imgManager.isValid(file, cb);
  }
}).single('profileImg');

connection.connect();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'view');
// app.use(passport.initialize());
app.use(express.static('static'));
app.use('/img', express.static('./images'));
app.use(express.static('./public'));
// app.use('profile', express.static('./public/profile_images'));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

// Routes

app.get('/', (req, res) => {
  res.render('list.ejs', {req:req});
});

app.get('/addRecipe', (req, res) => {
  // console.log('hello');
  isLoggedIn(req, (error) => {
    if (error) {
      return res.redirect('/login');
    } else {
      // console.log('no error')
    }
    res.render('recipeForm.ejs');
  });
});

app.get('/register', (req, res) => {
  let result = {
    error: {
      user_firstName: null,
      user_lastName: null,
      user_email: null,
      user_password: null,
      user_passwordConf: null
    },
    data: {
      user_firstName: null,
      user_lastName: null,
      user_email: null,
      user_password: null,
      user_passwordConf: null
    },
    msg: {
      user_firstName: null,
      user_lastName: null,
      user_email: null,
      user_password: null,
      user_passwordConf: null
    }
  };
  res.render('register.ejs', Object.assign({}, result, {req: req}));
});

app.get('/login', (req, res) => {
  let error = {
    error: null,
    msg: null,
    value: null
  };
  res.render('login.ejs', Object.assign({}, error, {req: req}));
});

app.get('/account', (req, res, next) => {
  // let id = req.params.id;
  isLoggedIn(req, (error) => {
    if (error) {
      return res.redirect('/login');
    }
  });
  connection.query(`SELECT * FROM accounts WHERE accounts.userID = ${req.session.userId}`, (err, data) => {
    if (err) {
      return console.log(err);
    } else {

      imgManager.tryFind('./public/profile_images', req.session.userId, (file) => {

          res.render('account.ejs', Object.assign({}, {user: data[0]}, {req: req}, {img: file}));
      });

    }
  });
});

app.get('/account/edit', (req, res, uploadStatus) => {

  isLoggedIn(req, (error) => {
    if (error) {
      return res.redirect('/login');
    }
  });

  connection.query(`SELECT * FROM accounts WHERE accounts.userID = ${req.session.userId}`, (err, data) => {
    if (err) {
      return console.log(err);
    } else {

      imgManager.tryFind('./public/profile_images', req.session.userId, (file) => {
          res.render('account_edit.ejs', Object.assign({}, {user: data[0]}, {req: req}, {img: file}, uploadStatus));
      });
    }
  });
});

app.get('/logout', (req, res, next) => {
  if (req.session.userId) {
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// Let User Make An Account
app.post('/register', (req, res, next) => {

  let result = checker(req.body);

  if (Object.keys(result.error).length > 0) {

    return res.render('register.ejs', Object.assign({}, result, {req: req}));

  } else {
    connection.query(`SELECT id FROM users WHERE users.email = ${connection.escape(req.body.user_email)}`, (err, emails) => {

      if (emails.length > 0) {
        result.error.user_email = 'isInvalid';
        result.data.user_email = null;
        result.msg.user_email = 'Already in use';

        return res.render('register.ejs', Object.assign({}, result, {req: req}));
      } else {

        let x = req.body.user_password;

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(x, salt, function(err, hash) {
                if (err) {
                  return next(err);
                } else {
                  x = hash;

                  connection.query(`INSERT INTO users (email, password) VALUES(
                    ${connection.escape(req.body.user_email)},
                    "${x}"
                  );
                  INSERT INTO accounts (first_name, last_name, userID) VALUES(
                    ${connection.escape(capt(req.body.user_firstName))},
                    ${connection.escape(capt(req.body.user_lastName))},
                    LAST_INSERT_ID()
                  );`, (err, data) => {
                    if (err) {
                      next(err);
                    } else {
                      console.log(req.body.user_email)
                      connection.query(`SELECT users.id FROM users WHERE users.email = ${connection.escape(req.body.user_email)}`, (err, user) => {
                        if (err) {
                          next(err);
                        } else {
                          // console.log(id)
                          req.session.userId = user[0].id;
                          res.redirect('/');
                        }
                      });

                    }
                  });
                }
            });
        });
      }
    });
  }
});

// Let User Log In
app.post('/login', (req, res, next) => {
  let error = {
    error: 'isInvalid',
    msg: 'Wrong email or password',
    value: null
  };

  if (emailValidator.validate(req.body.user_email) == false) {
    return res.render('login.ejs', Object.assign({}, error, {req: req}));
  }

  connection.query(`SELECT * FROM users WHERE users.email = ${connection.escape(req.body.user_email)}`, (err, user) => {
    if (err) {
      return console.log(err);
    }
    if (!user[0]) {
      error.msg = `User doesn't exist`;
      return res.render('login.ejs', Object.assign({}, error, {req: req}));
    }
    else {
    bcrypt.compare(req.body.user_password, user[0].password, function(err, pass) {
      if (err) {
        return next(err);
      } else if (pass == false) {
        error.msg = 'Wrong password';
        return res.render('login.ejs', Object.assign({}, error, {req: req}));
      } else {
        // Email and password are correct
        req.session.userId = user[0].id;
        res.redirect('/');
      }
    });
  }
  });
});

app.post('/saveAccount', (req, res, next) => {
  connection.query(`UPDATE accounts SET accounts.age = ${connection.escape(req.body.user_age)}, accounts.description = ${connection.escape(req.body.user_description)} WHERE accounts.userID = ${connection.escape(req.session.userId)}`, (err, succes) => {
      if (err) {
        return console.log(err);
      } else {
        console.log(`The changes made to '${req.session.userId}' have been saved`);

        res.redirect('/account');
      }
    });
});

app.post('/usrImg', (req, res, next) => {

  upload(req, res, (err) => {
    if (err) {
      next(err);
    } else {
      if (req.file == undefined) {
        return next("No file selected");
      }
      return res.redirect('/account/edit');
    }
  });
});


// Check if the user is logged in
function isLoggedIn(req, error) {
  console.log('User id:', !req.session.userId);
    if (!req.session.userId) {
      return error(true);
    } else {
      return error(false);
    }
}


app.listen(3000, () => {
  console.log('Listening to port 3000');
});

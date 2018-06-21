/* jshint esversion: 6 */
/* jshint node: true */

'use strict';
const checker = require('./checkinputs.js');

const ejs = require('ejs');
const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const emailValidator = require('email-validator');
const session = require('express-session');

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

connection.connect();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'view');
// app.use(passport.initialize());
app.use(express.static('static'));
app.use('/img', express.static('images'));
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
  console.log(req);
  res.render('list.ejs', {req:req});
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
  console.log(req);
  res.render('register.ejs', Object.assign({}, result, {req: req}));
});

app.get('/login', (req, res) => {
  let error = {
    error: null,
    msg: null,
    value: null
  };
  console.log(req);
  res.render('login.ejs', Object.assign({}, error, {req: req}));
});

// Let User Make An Account
app.post('/register', (req, res, next) => {

  let result = checker(req.body);

  if (Object.keys(result.error).length > 0) {

    return res.render('register.ejs', Object.assign({}, result, {req: req}));

  } else {
    connection.query(`SELECT id FROM users WHERE users.email = '${req.body.user_email}'`, (err, emails) => {

      if (emails.length > 0) {
        result.error.user_email = 'isInvalid';
        result.data.user_email = null;
        result.msg.user_email = 'Already in use';

        return res.render('register.ejs', Object.assign({}, result, {req: req}))
      } else {

        let x = req.body.user_password;

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(x, salt, function(err, hash) {
                if (err) {
                  return next(err);
                } else {
                  x = hash;

                  connection.query(`INSERT INTO users (email, password) VALUES(
                    "${req.body.user_email}",
                    "${x}"
                  );
                  INSERT INTO accounts (first_name, last_name, userID) VALUES(
                    "${req.body.user_firstName}",
                    "${req.body.user_lastName}",
                    LAST_INSERT_ID()
                  );`, (err, data) => {
                    if (err) {
                      next(err);
                    } else {
                      res.redirect('/');
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

  connection.query(`SELECT * FROM users WHERE users.email = '${req.body.user_email}'`, (err, user) => {
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

app.listen(3000, () => {
  console.log('Listening to port 3000');
});

/* jshint esversion: 6 */
/* jshint node: true */

'use strict';

const ejs = require('ejs');
const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
// const salt = bcrypt.genSaltSync(10);

const checker = require('./checkinputs.js');

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
app.use(express.static('static'));
app.use('/img', express.static('images'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Routes

app.get('/', (req, res) => {
  res.render('list.ejs');
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

  res.render('register.ejs', result);
});

app.get('/login', (req, res) => {
  console.log('yes');
  res.render('login.ejs');
});

// Let User Make An Account
app.post('/register', (req, res, next) => {

  let result = checker(req.body);

  if (Object.keys(result.error).length > 0) {

    return res.render('register.ejs', result);

  } else {
    connection.query(`SELECT id FROM users WHERE users.email = '${req.body.user_email}'`, (err, emails) => {

      if (emails.length > 0) {
        result.error.user_email = 'isInvalid';
        result.data.user_email = null;
        result.msg.user_email = 'Already in use';

        return res.render('register.ejs', result)
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

    })
  }


});

// Let User Log In
app.post('/login', (req, res) => {
  console.log(req.body);
});


app.listen(3000, () => {
  console.log('Listening to port 3000');
});

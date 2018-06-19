/* jshint esversion: 6 */
/* jshint node: true */

'use strict';

const ejs = require('ejs');
const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcryptjs');

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
  console.log('yes');
  res.render('register.ejs');
});

app.get('/login', (req, res) => {
  console.log('yes');
  res.render('login.ejs');
});

// Let User Make An Account
app.post('/register', (req, res) => {
  console.log(req.body);
});

// Let User Log In
app.post('/login', (req, res) => {
  console.log(req.body);
});


app.listen(3000, () => {
  console.log('Listening to port 3000');
});

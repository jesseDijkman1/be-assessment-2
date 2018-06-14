/* jshint esversion: 6 */
/* jshint node: true */

'use strict';

const ejs = require('ejs');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'view');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Routes

app.get('/', (req, res) => {
  res.send('hi')
});




app.listen(3000, () => {
  console.log('Listening to port 3000');
});

/* @flow */
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
require('./utils/dbconn.js');

const server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.use("/",express.static(path.join(__dirname, '../dist')));

app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.text({ limit: '50mb' }));

const authCtrl = require('./controllers/userauth');
const pollCtrl = require('./controllers/poll');

app.use('/api/auth', authCtrl);
app.use('/api/polls', pollCtrl);

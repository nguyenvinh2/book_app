'use strict';

const express = require('express');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded({extended: true}));
app.use(express.static('public')); //Was this right?

app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  response.render('pages/index');
})







app.listen(PORT, () => console.log(`Listening on ${PORT}`));
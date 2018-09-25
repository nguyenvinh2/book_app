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

app.post('/searches', searchBook);

function searchBook(request,response){
  let url = 'https://www.googleapis.com/book/v1/volumes?q=';
  if (request.body.search[1] === 'title') {url += `+intitle:${request.body.search[0]}`;}
  if (request.body.search[1] === 'author') {url += `+inauthor:${request.body.search[0]}`;}
  superagent.get(url)
    .then(bookResponse => bookResponse.body.items.map(book => {
    // return new Book(book.valumeInfo);
      console.log(book.volumeInfo);
    }))
}





app.listen(PORT, () => console.log(`Listening on ${PORT}`));

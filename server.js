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
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (request.body.search[1] === 'title') {url += `+intitle:${request.body.search[0]}`;}
  if (request.body.search[1] === 'author') {url += `+inauthor:${request.body.search[0]}`;}
  superagent.get(url)
    .then(bookResponse => {
      const bookList = bookResponse.body.items.map(book => {
        const bookItem = new Book(book);
        return bookItem;
      });
      return bookList;
    })
    .then(bookList => {
      response.render('pages/searches/show', {bookArr: bookList});
    })
}

function Book (info) {
  this.title = info.volumeInfo.title || 'No Title Available';
  this.author = info.volumeInfo.authors || 'Auhtor information unvailable';
  // this.isbn = info.volumeInfo.industryIdentifiers[0].identifier;
  this.imgUrl = info.volumeInfo.imageLinks.thumbnail;
  this.description = info.volumeInfo.description || 'No description available';
}




app.listen(PORT, () => console.log(`Listening on ${PORT}`));

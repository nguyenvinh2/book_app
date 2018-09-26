'use strict';

const express = require('express');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT || 3000;
const pg = require('pg');
const client = new pg.Client('postgres://postgres:hacker@localhost:5432/books_app');
client.connect();
client.on('error', err => console.error(err));

require('dotenv').config();
app.use(express.urlencoded({extended: true}));
app.use(express.static('public')); //Was this right?

app.set('view engine', 'ejs');

app.get('/', getBooks);

app.get('/books/:book_id', getBookDetail);

app.post('/searches', searchBook);

function getBookDetail(request, response) {
  let SQL = 'SELECT * FROM books WHERE id=$1;';
  let values = [request.params.book_id];
  console.log(values);

  return client.query(SQL, values)
    .then(result => {
      console.log(result);
      response.render('pages/detail-view', { book: result.rows[0] });

    })
    .catch(handleError);
}






function getBooks(request, response) {
  let SQL = 'SELECT * from books;';

  return client.query(SQL)
    .then(results => response.render('pages/index', { results: results.rows }))
    .catch(handleError);
}

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
    .catch(error => handleError(error, response));
}

function handleError(err, res) {
  res.render('pages/error', {error: err, response: res});
}

function Book (info) {
  this.title = info.volumeInfo.title || 'No Title Available';
  this.author = info.volumeInfo.authors || 'Auhtor information unvailable';
  // this.isbn = info.volumeInfo.industryIdentifiers[0].identifier;
  this.imgUrl = info.volumeInfo.imageLinks.thumbnail;
  this.description = info.volumeInfo.description || 'No description available';
}




app.listen(PORT, () => console.log(`Listening on ${PORT}`));

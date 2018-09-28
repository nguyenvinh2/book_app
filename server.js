'use strict';

require('dotenv').config();

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);
const methodOverride = require('method-override');

client.connect();
client.on('error', err => console.error(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))

app.set('view engine', 'ejs');
app.get('/', getBooks);
app.get('/searches', homepage);
app.get('/books/:book_id', getBookDetail);
app.post('/searches', searchBook);
app.post('/add', addBook);
app.put('/update/:book_id', updateBook);
app.delete('/delete/:book_id', deleteBook);

function updateBook(request, response) {
  console.log(request.params.book_id);
  let { title, author, isbn, imageurl, description, bookshelf } = request.body;
  let SQL = `UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5, bookshelf=$6 WHERE id=$7;`;
  let values = [title, author, isbn, imageurl, description, bookshelf, request.params.book_id];

  client.query(SQL, values)
    .then(response.redirect(`/books/${request.params.book_id}`))
    .catch(err => handleError(err, response));
}

function deleteBook(request, response) {
  let values = [request.params.book_id];
  console.log(values);
  let SQL = `DELETE FROM books WHERE id=$1;`;

  client.query(SQL, values)
    .then(response.redirect('/'))
    .catch(err => handleError(err, response));
}

function addBook(request, response) {
  let { title, author, isbn, imageurl, description, bookshelf } = request.body;
  let SQL = 'INSERT INTO books(title, author, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);';
  let values = [title, author, isbn, imageurl, description, bookshelf];
  return client.query(SQL, values)
    .then(response.redirect('/'))
    .catch(err => handleError(err, response));
}

function getBookDetail(request, response) {
  let SQL = 'SELECT * FROM books WHERE id=$1;';
  let values = [request.params.book_id];

  return client.query(SQL, values)
    .then(result => {
      response.render('pages/detail-view', { book: result.rows[0] });

    })
    .catch(handleError);
}


function homepage(request, response) {
  response.render('pages/searches/new');
}

function getBooks(request, response) {
  let SQL = 'SELECT * from books;';

  return client.query(SQL)
    .then(results => response.render('pages/index', { results: results.rows }))
    .catch(handleError);
}

function searchBook(request, response) {
  let url;
  if (request.body.search[1] === 'title') { url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${request.body.search[0]}&maxResults=40`; }
  else if (request.body.search[1] === 'author') {url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${request.body.search[0]}&maxResults=40`; }
  superagent.get(url)
    .then(bookResponse => {
      const bookList = bookResponse.body.items.map(book => {
        const bookItem = new Book(book);
        book.volumeInfo.imageLinks !== undefined ? bookItem.addImage(book.volumeInfo.imageLinks.thumbnail) : bookItem.addImage('Image Unavailable');
        book.volumeInfo.industryIdentifiers !== undefined ? bookItem.addISBN(book.volumeInfo.industryIdentifiers[0].type, book.volumeInfo.industryIdentifiers[0].identifier) : bookItem.addISBN('ISBN', 'Unavailable');
        return bookItem;
      });
      return bookList;
    })
    .then(bookList => {
      response.render('pages/searches/show', { bookArr: bookList });
    })
    .catch(error => handleError(error, response));
}

function handleError(err, res) {
  res.render('pages/error', { error: err, response: res });
}

function Book(info) {
  this.title = info.volumeInfo.title || 'Title Information Available';
  this.author = info.volumeInfo.authors || 'Author Information Unvailable';
  this.isbn = '';
  this.imgUrl ='';
  this.description = info.volumeInfo.description || 'Description Unavailable';
}

Book.prototype.addImage = function(image) {
  this.imgUrl = image;
}

Book.prototype.addISBN = function (isbn, number) {
  this.isbn = `${isbn}: ${number}`;
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

--This step populates the name column of "bookshelves" using the unique record entries in the bookshelf column from table "books"

INSERT INTO bookshelves(name) SELECT DISTINCT bookshelf FROM books;
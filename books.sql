DROP TABLE IF EXISTS books;

CREATE TABLE IF NOT EXISTS books ( 
  id SERIAL PRIMARY KEY, 
  author text, 
  title text, 
  isbn VARCHAR(255), 
  image_url VARCHAR(255),
  description text,
  bookshelf VARCHAR(255)
);
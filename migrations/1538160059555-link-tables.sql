--This step links the column bookshelf_id from "books" to automatically equal the primary key column id in "bookshelves" to link the two tables.-- 

ALTER TABLE books ADD CONSTRAINT fk_bookshelves FOREIGN KEY (bookshelf_id) REFERENCES bookshelves(id);
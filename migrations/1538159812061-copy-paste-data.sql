--This steps copies the automatically id entry located in the table "bookshelves" and pastes it in the new column bookshelf_id in table "books"--
--It compares the data entry between name column from "bookshelves" and the bookshelf column from "books" to ensure the correct id--
--is selected.==

UPDATE books SET bookshelf_id=shelf.id FROM (SELECT * FROM bookshelves) AS shelf WHERE books.bookshelf = shelf.name;
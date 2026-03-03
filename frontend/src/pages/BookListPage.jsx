import React, { useEffect, useState } from "react";

export default function BookListPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/books")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => {
        (setError(error), console.error("Failed: ", error));
      });
  }, []);

  const bookList = books.map((book) => <li key={book.id}>{book.title}</li>);
  return <div>{bookList}</div>;
}

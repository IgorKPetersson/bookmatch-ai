import { useState } from "react";

export default function Index() {
  const [books, setBooks] = useState([]);

  async function fetchBooks() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("DATA:", data);
setBooks(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h1>INDEX TEST 123</h1>

      <button
        style={{ border: "2px solid red", padding: "10px" }}
        onClick={fetchBooks}
      >
        Hämta böcker
      </button>

      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
}
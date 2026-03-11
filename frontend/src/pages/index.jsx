import { useState } from "react";

export default function Index() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  async function fetchBooks() {
    try {
      setError("");



      const res = await fetch("http://localhost:8000/books", {
        credentials: "include",
        headers: {
        },
      });

      const data = await res.json();

      if (res.status === 401) {
        setError("Login to be able to list books");
        return;
      }

      setBooks(data);
    } catch (err) {
      setError("Something went wrong");
    }
  }

  return (
    <div>
      <h1>Welcome to Bookmatch AI</h1>

      <button
        style={{ border: "2px solid red", padding: "10px" }}
        onClick={fetchBooks}
      >
        Fetch Books
      </button>

      {error && <p>{error}</p>}

      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
}
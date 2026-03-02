import { useEffect, useState } from "react";

function App() {
  const [books, setBooks] = useState([]);
  const [token, setToken] = useState("");

  // Logga in automatiskt och spara token
  useEffect(() => {
    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com", password: "123456" }),
    })
      .then(res => res.json())
      .then(data => {
        setToken(data.access_token);
        fetchBooks(data.access_token);
      })
      .catch(err => console.error(err));
  }, []);

  // Hämta böcker med token
  const fetchBooks = (token) => {
    fetch("http://localhost:8000/books", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error(err));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Books</h1>
      {books.map((book) => (
        <div key={book.id} className="border p-4 mb-2 rounded">
          <h2 className="font-semibold">{book.title}</h2>
          <p>{book.authors}</p>
          <p className="text-sm text-gray-500">{book.genre}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
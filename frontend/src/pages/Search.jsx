import PageContainer from "../components/PageContainer";
import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import { Link } from "react-router-dom";

export default function Search() {
  const [activeField, setActiveField] = useState("book1");
  const [book1, setBook1] = useState("");
  const [book2, setBook2] = useState("");
  const [book3, setBook3] = useState("");
  const [genre, setGenre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
  const query =
  activeField === "book1" ? book1 :
  activeField === "book2" ? book2 :
  activeField === "book3" ? book3 : "";

  if (query.length < 2) return;

  const timeout = setTimeout(() => {
    fetch(`http://localhost:8000/recommendations/search?query=${
      activeField === "book1" ? book1 :
      activeField === "book2" ? book2 :
      activeField === "book3" ? book3 : ""
    }`)
      .then(res => res.json())
      .then(data => {
        console.log("RESULTS:", data);
        setResults(data);
      })
      .catch(err => console.error(err));
  }, 300);

  return () => clearTimeout(timeout);
}, [book1, book2, book3, activeField]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setNeedsLogin(false);

      const res = await fetch("http://localhost:8000/recommendations", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favorite_books: [book1, book2, book3],
          genre: genre,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setRecommendations(data.recommendations);
      } else if (res.status === 401) {
        setNeedsLogin(true);
      } else {
        setError("Something went wrong.");
      }

    } catch {
      setError("Could not fetch recommendations.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-6">
        Book Recommendations
      </h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Selected Books</h2>

        <div className="grid grid-cols-3 gap-4">

          {/* Book 1 */}
          <div className="border rounded p-3 h-24 flex items-center justify-center text-gray-400">
            {book1 ? book1 : "Book 1"}
          </div>

          {/* Book 2 */}
          <div className="border rounded p-3 h-24 flex items-center justify-center text-gray-400">
            {book2 ? book2 : "Book 2"}
          </div>

          {/* Book 3 */}
          <div className="border rounded p-3 h-24 flex items-center justify-center text-gray-400">
            {book3 ? book3 : "Book 3"}
          </div>
        </div>
      </div>




      <div className="bg-white shadow rounded-xl p-6 mb-10">

        <h2 className="text-xl font-semibold mb-4">
          Find Books You Might Like
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Book 1"
            className="border rounded px-3 py-2"
            onChange={(e) => setBook1(e.target.value)}
          />
          {results.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-4">
              {results.map((book, i) => (
                <div
                  key={i}
                  className="border rounded p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (activeField === "book1") setBook1(book.title);
                    if (activeField === "book2") setBook2(book.title);
                    if (activeField === "book3") setBook3(book.title);
                    setResults([]);
                  }}
                >
                  <img
                    src={book.image}
                    alt=""
                    className="w-full h-40 object-cover mb-2"
                  />
                  <div>
                    <div className="font-semibold">{book.title}</div>
                    <div className="text-sm text-gray-500">{book.authors}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <input
            type="text"
            placeholder="Book 2"
            className="border rounded px-3 py-2"
            onFocus={() => setActiveField("book2")}
            onChange={(e) => setBook2(e.target.value)}
          />

          <input
            type="text"
            placeholder="Book 3"
            className="border rounded px-3 py-2"
            onFocus={() => setActiveField("book3")}
            onChange={(e) => setBook3(e.target.value)}
          />

          <input
            type="text"
            placeholder="Genre (optional)"
            className="border rounded px-3 py-2"
            onChange={(e) => setGenre(e.target.value)}
          />

        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Get Recommendations
        </button>

      </div>

      {loading && <p>Fetching books...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {needsLogin && <Link to="/auth">Please log in</Link>}

      {recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Recommended For You
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {recommendations.map((rec, index) => (
              <BookCard
                key={index}
                title={rec.title}
                authors={rec.authors}
                description={rec.description}
                isbn={rec.isbn}
                genre={rec.genre}
                release_date={rec.release_date}
                image={rec.image}
                reason={rec.reason}
              />
            ))}
          </div>
        </div>
      )}

    </PageContainer>
  );
}
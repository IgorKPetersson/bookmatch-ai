import PageContainer from "../components/PageContainer";
import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import { Link } from "react-router-dom";

export default function Search() {
  const [activeField, setActiveField] = useState("book1");

  const [input1, setInput1] = useState("");
  const [selected1, setSelected1] = useState("");

  const [input2, setInput2] = useState("");
  const [selected2, setSelected2] = useState("");

  const [input3, setInput3] = useState("");
  const [selected3, setSelected3] = useState("");

  const [genre, setGenre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const query =
      activeField === "book1"
        ? input1
        : activeField === "book2"
        ? input2
        : activeField === "book3"
        ? input3
        : null;

    if (!query) return;

    if (query.length < 3) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(
        `http://localhost:8000/recommendations/search?query=${query}&start=${page * 9}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0 && !data.error) {
            setResults(data);
          }
        })
        .catch((err) => console.error(err));
    }, 300);

    return () => clearTimeout(timeout);
  }, [activeField, page, input1, input2, input3]);

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
          favorite_books: [selected1, selected2, selected3],
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
      <h1 className="text-3xl font-bold mb-6">Book Recommendations</h1>

      {/* Selected books */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Selected Books</h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded p-3 h-24 flex items-center justify-center text-gray-400">
            {selected1 || "Book 1"}
          </div>
          <div className="border rounded p-3 h-24 flex items-center justify-center text-gray-400">
            {selected2 || "Book 2"}
          </div>
          <div className="border rounded p-3 h-24 flex items-center justify-center text-gray-400">
            {selected3 || "Book 3"}
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
            value={input1}
            onFocus={() => {
              setActiveField("book1");
              setPage(0);
            }}
            onChange={(e) => {
              setPage(0);
              setInput1(e.target.value);
            }}
          />

          <input
            type="text"
            placeholder="Book 2"
            className="border rounded px-3 py-2"
            value={input2}
            onFocus={() => {
              setActiveField("book2");
              setPage(0);
            }}
            onChange={(e) => {
              setPage(0);
              setInput2(e.target.value);
            }}
          />

          <input
            type="text"
            placeholder="Book 3"
            className="border rounded px-3 py-2"
            value={input3}
            onFocus={() => {
              setActiveField("book3");
              setPage(0);
            }}
            onChange={(e) => {
              setPage(0);
              setInput3(e.target.value);
            }}
          />

          <input
            type="text"
            placeholder="Genre (optional)"
            className="border rounded px-3 py-2"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Get Recommendations
          </button>
        </div>

        {results.length > 0 && (
          <>
            {/* BOOK GRID */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {results.map((book, i) => (
                <div
                  key={i}
                  className="border rounded p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (activeField === "book1") setSelected1(book.title);
                    if (activeField === "book2") setSelected2(book.title);
                    if (activeField === "book3") setSelected3(book.title);
                  }}
                >
                  <img
                    src={book.image}
                    alt=""
                    className="w-full h-40 object-cover mb-2"
                  />
                  <div className="font-semibold text-sm">{book.title}</div>
                  <div className="text-xs text-gray-500">
                    {book.authors}
                  </div>
                </div>
              ))}
            </div>

            {/* BUTTONS BELOW GRID */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() =>
                  setPage((prev) => Math.max(prev - 1, 0))
                }
                className="px-4 py-2 bg-gray-200 rounded"
                disabled={page === 0}
              >
                Previous
              </button>

              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={results.length === 0}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Next
              </button>
            </div>
          </>
        )}
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
              <BookCard key={index} {...rec} />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
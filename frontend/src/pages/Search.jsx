import PageContainer from "../components/PageContainer";
import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import { Link } from "react-router-dom";

export default function Search() {
  const [activeField, setActiveField] = useState("book1");

  const [input1, setInput1] = useState("");
  const [selected1, setSelected1] = useState(null);

  const [input2, setInput2] = useState("");
  const [selected2, setSelected2] = useState(null);

  const [input3, setInput3] = useState("");
  const [selected3, setSelected3] = useState(null);

  const [genre, setGenre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);

  const activeBookNumber =
    activeField === "book1" ? 1 : activeField === "book2" ? 2 : 3;

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
        `http://localhost:8000/recommendations/search?query=${query}&start=${page * 9}`,
        { credentials: "include" }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0 && !data.error) {
            setResults(data);
          }
        })
        .catch(console.error);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          favorite_books: [selected1, selected2, selected3],
          genre,
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

      <div className="mb-6 rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-gray-700">
        <p className="mb-2">
          Search for one, two, or three books you already enjoy to get AI-based
          recommendations tailored to your taste.
        </p>
        <p className="mb-2">
          Start typing in any book field below and choose a title from the
          search results. You can use just one book, combine two favorites, or
          select three books for a broader recommendation profile.
        </p>
        <p>
          Genre filtering is shown as an optional field and is planned to work
          together with your selected books, so you will later be able to
          combine favorite titles with genres for even more precise
          recommendations.
        </p>
      </div>

      {/* Selected books */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Selected Books</h2>

        <div className="grid grid-cols-3 gap-4">
          {[selected1, selected2, selected3].map((selected, i) => (
            <div className="border rounded h-20 grid grid-cols-[auto_1fr_auto]">
              {selected ? (
                <>
                  <div className="flex items-center">
                    <img
                      src={selected.image}
                      alt=""
                      className="h-16 w-14 object-cover rounded block m-[6px]"
                    />
                  </div>

                  <div className="p-[2px] flex items-center">
                    <span className="text-sm line-clamp-2">
                      {selected.title}
                    </span>
                  </div>

                  <div className="flex items-start justify-end p-1">
                    <button
                      type="button"
                      className="text-xs text-gray-500 hover:text-red-600"
                      onClick={() => {
                        [setInput1, setInput2, setInput3][i]("");
                        [setSelected1, setSelected2, setSelected3][i](null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-[2px] flex items-center col-span-3">
                  <span className="text-gray-400 text-sm">
                    Book {i + 1}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Search inputs */}
      <div className="bg-white shadow rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Find Books You Might Like
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Type to search, then click a result to add or replace a selected
          book.
        </p>

        <div className="grid md:grid-cols-4 gap-4">
          {[input1, input2, input3].map((input, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Book ${i + 1}`}
              className="border rounded px-3 py-2"
              value={input}
              onFocus={() => {
                setActiveField(`book${i + 1}`);
                setPage(0);
              }}
              onChange={(e) => {
                const value = e.target.value;
                setPage(0);
                [setInput1, setInput2, setInput3][i](value);

                if (!value.trim()) {
                  [setSelected1, setSelected2, setSelected3][i](null);
                }
              }}
            />
          ))}

          <input
            type="text"
            placeholder="Genre (optional)"
            className="border rounded px-3 py-2"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>

        <p className="mt-4 text-sm text-blue-700">
          Results for Book {activeBookNumber}
        </p>

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
            <div className="mt-6 grid grid-cols-3 gap-4">
              {results.map((book, i) => (
                <div
                  key={i}
                  className="border rounded p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (activeField === "book1") setSelected1(book);
                    if (activeField === "book2") setSelected2(book);
                    if (activeField === "book3") setSelected3(book);
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

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                className="px-4 py-2 bg-gray-200 rounded"
                disabled={page === 0}
              >
                Previous
              </button>

              <button
                onClick={() => setPage((p) => p + 1)}
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
            {recommendations.map((rec, i) => (
              <BookCard key={i} {...rec} />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}

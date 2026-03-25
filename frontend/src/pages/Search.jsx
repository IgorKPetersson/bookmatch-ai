import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const pageBackground = "#f7f3ee";
const cardBackground = "#ffffff";
const textPrimary = "#1a1a1a";
const textSecondary = "#5f574f";
const textMuted = "#8d7f70";
const borderColor = "#e0dbd3";
const dividerColor = "#f0ece6";
const shadow = "0 1px 6px rgba(0,0,0,0.06)";
const accent = "#4f6ef7";
const accentSoft = "#eef2ff";
const accentBorder = "#c7d2fe";

const sectionLabelStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: textMuted,
  marginBottom: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const cardStyle = {
  background: cardBackground,
  borderRadius: "16px",
  boxShadow: shadow,
};

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
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [selectedListPerRec, setSelectedListPerRec] = useState({});

  const [lists, setLists] = useState([]);
  const [submittedBooks, setSubmittedBooks] = useState([]);
  const [submittedGenre, setSubmittedGenre] = useState("");

  const activeBookNumber =
    activeField === "book1" ? 1 : activeField === "book2" ? 2 : 3;

  const GENRES = [
    "Adventure",
    "Autobiography",
    "Biography",
    "Children's",
    "Crime",
    "Dystopian",
    "Fantasy",
    "Fiction",
    "Graphic Novel",
    "Historical Fiction",
    "Horror",
    "Memoir",
    "Mystery",
    "Nonfiction",
    "Poetry",
    "Romance",
    "Science Fiction",
    "Self-Help",
    "Thriller",
    "Young Adult",
  ];

  async function loadLists() {
    try {
      const res = await fetch("http://localhost:8000/booklists", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setLists([]);
        return [];
      }

      const data = await res.json();
      const nextLists = Array.isArray(data)
        ? data.map((list) => ({
            id: list.id,
            name: list.name,
          }))
        : [];
      setLists(nextLists);
      return nextLists;
    } catch {
      setLists([]);
      return [];
    }
  }

  useEffect(() => {
    fetch("http://localhost:8000/books", {
      credentials: "include",
    })
      .then((res) => {
        setLoggedIn(res.ok);
      })
      .catch(() => {
        setLoggedIn(false);
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []);

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    const query =
      activeField === "book1"
        ? input1
        : activeField === "book2"
          ? input2
          : input3;

    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(
        `http://localhost:8000/recommendations/search?query=${query}&start=${page * 8}`,
        { credentials: "include" },
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0 && !data.error) setResults(data);
        })
        .catch(console.error);
    }, 300);

    return () => clearTimeout(timeout);
  }, [activeField, page, input1, input2, input3]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (authChecked && !loggedIn) {
      setNeedsLogin(true);
      return;
    }

    try {
      const books = [selected1, selected2, selected3]
        .filter(Boolean)
        .map((b) => b.title);
      setLoading(true);
      setError("");
      setNeedsLogin(false);
      setSubmittedBooks(books);
      setSubmittedGenre(genre);
      const res = await fetch("http://localhost:8000/recommendations", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          favorite_books: books,
          genre,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await loadLists();
        setRecommendations(data.recommendations.slice(0, 2));
        setSelectedListPerRec({});
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

  function handleDismiss(i) {
    fetch("http://localhost:8000/recommendations/reshuffle", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        favorite_books: submittedBooks,
        genre: submittedGenre,
        rejected_books: [recommendations[i].title],
        keep_books: recommendations
          .filter((_, idx) => idx !== i)
          .map((rec) => rec.title),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newBook = data.recommendations[0];
        setRecommendations((prev) =>
          prev.map((rec, idx) => (idx === i ? newBook : rec)),
        );
      });
  }

  async function handleAddToList(rec, i) {
    const listId = selectedListPerRec[i] ?? lists[0]?.id;
    const res = await fetch("http://localhost:8000/recommendations/save", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book_list_id: listId,
        books: [
          {
            title: rec.title,
            authors: rec.authors,
            description: rec.description,
            isbn: rec.isbn,
            release_date: rec.release_date,
            genre: rec.genre,
            image: rec.image,
          },
        ],
      }),
    });
    if (res.ok) {
      handleDismiss(i);
    } else if (res.status === 409) {
      alert("This book is already saved in this list.");
    } else {
      alert("Failed to save book.");
    }
  }

  return (
    <div style={{ backgroundColor: pageBackground, minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold" style={{ color: textPrimary }}>
            Book Recommendations
          </h1>
          <p className="mt-2 max-w-3xl" style={{ color: textMuted }}>
            Find one to three books you already love, add an optional genre, and
            let BookMatch suggest your next read in the same warm, curated style
            as the rest of the app.
          </p>
        </div>

        <div
          className="mb-6"
          style={{
            background: accentSoft,
            border: `1px solid ${accentBorder}`,
            borderRadius: "12px",
            padding: "16px 20px",
            fontSize: "13px",
            color: textSecondary,
            lineHeight: 1.7,
          }}
        >
          Search for one, two, or three books you enjoy, then click{" "}
          <strong style={{ color: textPrimary }}>Get Recommendations</strong>.
          You can review the AI picks and add them directly to one of your
          reading lists.
        </div>

        {authChecked && !loggedIn && (
          <div
            className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            style={{
              ...cardStyle,
              padding: "18px 20px",
              border: `1px solid ${dividerColor}`,
            }}
          >
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: textPrimary, margin: 0 }}
              >
                Log in to generate AI recommendations
              </p>
              <p className="mt-1 text-sm" style={{ color: textSecondary }}>
                You can browse books here first, but recommendation generation
                and saving to lists require an account.
              </p>
            </div>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center"
              style={{
                background: accent,
                color: "#ffffff",
                borderRadius: "10px",
                padding: "10px 18px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Log in
            </Link>
          </div>
        )}

        <div className="mb-6">
          <p style={sectionLabelStyle}>Selected Books</p>
          <div className="grid gap-3 md:grid-cols-3">
            {[selected1, selected2, selected3].map((selected, i) => (
              <div
                key={i}
                style={{
                  ...cardStyle,
                  border: `1px solid ${dividerColor}`,
                  minHeight: "84px",
                  display: "grid",
                  gridTemplateColumns: selected ? "auto 1fr auto" : "1fr",
                }}
              >
                {selected ? (
                  <>
                    <img
                      src={selected.image}
                      alt=""
                      style={{
                        height: "68px",
                        width: "48px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        margin: "8px",
                      }}
                    />
                    <div
                      style={{
                        padding: "10px 0",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          color: textPrimary,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {selected.title}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        [setInput1, setInput2, setInput3][i]("");
                        [setSelected1, setSelected2, setSelected3][i](null);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#b3a79a",
                        cursor: "pointer",
                        padding: "8px 12px 0 0",
                        fontSize: "18px",
                        alignSelf: "start",
                      }}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0 16px",
                    }}
                  >
                    <span style={{ fontSize: "14px", color: textMuted }}>
                      Book {i + 1}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8" style={{ ...cardStyle, padding: "24px" }}>
          <div className="grid gap-3 lg:grid-cols-4">
            {[input1, input2, input3].map((input, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Book ${i + 1}`}
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
                style={{
                  border: `1px solid ${borderColor}`,
                  borderRadius: "10px",
                  padding: "12px 14px",
                  fontSize: "14px",
                  outline: "none",
                  color: textPrimary,
                  background: cardBackground,
                }}
              />
            ))}
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              style={{
                border: `1px solid ${borderColor}`,
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "14px",
                outline: "none",
                color: textPrimary,
                background: cardBackground,
              }}
            >
              <option key="Genre" value="">
                Genre
              </option>
              {GENRES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={handleSubmit}
              disabled={loading || (authChecked && !loggedIn)}
              style={{
                background: authChecked && !loggedIn ? "#d8d2ca" : accent,
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: 600,
                cursor:
                  loading || (authChecked && !loggedIn)
                    ? "not-allowed"
                    : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Finding books..."
                : authChecked && !loggedIn
                  ? "Log in to get recommendations"
                  : "Get Recommendations"}
            </button>
            {error && (
              <span style={{ fontSize: "13px", color: "#c55b5b" }}>
                {error}
              </span>
            )}
            {needsLogin && (
              <Link to="/auth" style={{ fontSize: "13px", color: accent }}>
                Please log in
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <div>
            {results.length > 0 ? (
              <>
                <p style={sectionLabelStyle}>
                  Results for Book {activeBookNumber}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {results.map((book, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        if (activeField === "book1") setSelected1(book);
                        if (activeField === "book2") setSelected2(book);
                        if (activeField === "book3") setSelected3(book);
                      }}
                      style={{
                        ...cardStyle,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        border: `1px solid ${dividerColor}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 4px 16px rgba(0,0,0,0.10)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = shadow;
                      }}
                    >
                      <img
                        src={book.image}
                        alt=""
                        style={{
                          width: "48px",
                          height: "72px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: textPrimary,
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {book.title}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: textMuted,
                            margin: "4px 0 0",
                          }}
                        >
                          {book.authors}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    disabled={page === 0}
                    style={{
                      padding: "9px 18px",
                      borderRadius: "8px",
                      border: `1px solid ${borderColor}`,
                      background: cardBackground,
                      fontSize: "13px",
                      cursor: page === 0 ? "not-allowed" : "pointer",
                      color: page === 0 ? "#c9bfb4" : textSecondary,
                    }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    style={{
                      padding: "9px 18px",
                      borderRadius: "8px",
                      border: `1px solid ${borderColor}`,
                      background: cardBackground,
                      fontSize: "13px",
                      cursor: "pointer",
                      color: textSecondary,
                    }}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div
                style={{
                  ...cardStyle,
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "14px", color: textMuted }}>
                  Start typing to search for books.
                </p>
              </div>
            )}
          </div>

          <div>
            <p style={sectionLabelStyle}>AI Recommendations for You</p>

            {recommendations.length === 0 ? (
              <div
                style={{
                  ...cardStyle,
                  padding: "40px 20px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: textMuted,
                    lineHeight: 1.6,
                  }}
                >
                  Select a book above and click
                  <br />
                  <strong style={{ color: textSecondary }}>
                    Get Recommendations
                  </strong>
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {recommendations.map((rec, i) => (
                  <div
                    key={i}
                    style={{
                      ...cardStyle,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <img
                      src={rec.image}
                      alt={rec.title}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        borderTop: `1px solid ${dividerColor}`,
                      }}
                    >
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: textPrimary,
                          margin: "0 0 4px",
                          lineHeight: 1.3,
                        }}
                      >
                        {rec.title}
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: textMuted,
                          margin: "0 0 10px",
                        }}
                      >
                        {rec.authors}
                      </p>
                      <p
                        style={{
                          fontSize: "13px",
                          color: textSecondary,
                          lineHeight: 1.6,
                          margin: "0 0 14px",
                          flex: 1,
                        }}
                      >
                        {rec.reason}
                      </p>

                      <select
                        value={selectedListPerRec[i] ?? lists[0]?.id}
                        onChange={(e) =>
                          setSelectedListPerRec((prev) => ({
                            ...prev,
                            [i]: Number(e.target.value),
                          }))
                        }
                        style={{
                          width: "100%",
                          border: `1px solid ${borderColor}`,
                          borderRadius: "8px",
                          padding: "10px 12px",
                          fontSize: "13px",
                          color: textSecondary,
                          background: cardBackground,
                          marginBottom: "12px",
                          outline: "none",
                        }}
                      >
                        {lists.length > 0 ? (
                          lists.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.name}
                            </option>
                          ))
                        ) : (
                          <option value="">No lists available</option>
                        )}
                      </select>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToList(rec, i)}
                          style={{
                            flex: 1,
                            background: accent,
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 0",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Add to List
                        </button>
                        <button
                          onClick={() => handleDismiss(i)}
                          style={{
                            flex: 1,
                            background: "#f2ede6",
                            color: textSecondary,
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 0",
                            fontSize: "12px",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

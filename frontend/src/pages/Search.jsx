import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";

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
  const [selectedListPerRec, setSelectedListPerRec] = useState({});

  const [lists, setLists] = useState([]);

  const [submittedBooks, setSubmittedBooks] = useState([]);
  const [submittedGenre, setSubmittedGenre] = useState("");

  const activeBookNumber =
    activeField === "book1" ? 1 : activeField === "book2" ? 2 : 3;

  useEffect(() => {
    fetch("http://localhost:8000/booklists", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setLists(data));
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
      headers: { "Content-Type": "application/JSON" },
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
    const listName = lists.find((l) => l.id === listId)?.name;
    console.log("Saving:", rec);
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
    } else {
      alert("Failed to save book.");
    }
  }

  return (
    <PageContainer>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#1a1a1a",
          marginBottom: "24px",
        }}
      >
        Book Recommendations
      </h1>

      <div
        style={{
          background: "#eef2ff",
          border: "1px solid #c7d2fe",
          borderRadius: "12px",
          padding: "16px 20px",
          fontSize: "13px",
          color: "#555",
          marginBottom: "24px",
          lineHeight: 1.7,
        }}
      >
        Search for one, two, or three books you enjoy — then click{" "}
        <strong>Get Recommendations</strong> and the AI will suggest books
        tailored to your taste. You can add them directly to any of your lists.
      </div>

      {/* Selected books */}
      <div style={{ marginBottom: "20px" }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#888",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Selected Books
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
          }}
        >
          {[selected1, selected2, selected3].map((selected, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #e8e2da",
                borderRadius: "10px",
                height: "72px",
                display: "grid",
                gridTemplateColumns: selected ? "auto 1fr auto" : "1fr",
                background: "white",
              }}
            >
              {selected ? (
                <>
                  <img
                    src={selected.image}
                    alt=""
                    style={{
                      height: "60px",
                      width: "44px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      margin: "6px",
                    }}
                  />
                  <div
                    style={{
                      padding: "4px 0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#1a1a1a",
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
                      color: "#bbb",
                      cursor: "pointer",
                      padding: "6px 10px 0 0",
                      fontSize: "16px",
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
                    padding: "0 14px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#bbb" }}>
                    Book {i + 1}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Search inputs */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
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
                if (!value.trim())
                  [setSelected1, setSelected2, setSelected3][i](null);
              }}
              style={{
                border: "1px solid #e0dbd3",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "14px",
                outline: "none",
                color: "#1a1a1a",
              }}
            />
          ))}
          <input
            type="text"
            placeholder="Genre (optional)"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={{
              border: "1px solid #e0dbd3",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "14px",
              outline: "none",
              color: "#1a1a1a",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: "#4f6ef7",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Finding books…" : "Get Recommendations"}
          </button>
          {error && (
            <span style={{ fontSize: "13px", color: "#e57373" }}>{error}</span>
          )}
          {needsLogin && (
            <Link to="/auth" style={{ fontSize: "13px", color: "#4f6ef7" }}>
              Please log in
            </Link>
          )}
        </div>
      </div>

      {/* Two-column: search results + AI recommendations */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "28px",
          alignItems: "start",
        }}
      >
        {/* LEFT — Search results */}
        <div>
          {results.length > 0 ? (
            <>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#888",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Results for Book {activeBookNumber}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "12px",
                }}
              >
                {results.map((book, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (activeField === "book1") setSelected1(book);
                      if (activeField === "book2") setSelected2(book);
                      if (activeField === "book3") setSelected3(book);
                    }}
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 3px 12px rgba(0,0,0,0.12)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 1px 6px rgba(0,0,0,0.06)")
                    }
                  >
                    <img
                      src={book.image}
                      alt=""
                      style={{
                        width: "44px",
                        height: "64px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#1a1a1a",
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
                          color: "#999",
                          margin: "3px 0 0",
                        }}
                      >
                        {book.authors}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  disabled={page === 0}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    border: "1px solid #e0dbd3",
                    background: "white",
                    fontSize: "13px",
                    cursor: page === 0 ? "not-allowed" : "pointer",
                    color: page === 0 ? "#ccc" : "#555",
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    border: "1px solid #e0dbd3",
                    background: "white",
                    fontSize: "13px",
                    cursor: "pointer",
                    color: "#555",
                  }}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "48px 24px",
                textAlign: "center",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <p style={{ fontSize: "14px", color: "#bbb" }}>
                Start typing to search for books
              </p>
            </div>
          )}
        </div>

        {/* RIGHT — AI Recommendations */}
        <div>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#888",
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            AI Recommendations for You
          </p>

          {recommendations.length === 0 ? (
            <div
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "40px 20px",
                textAlign: "center",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <p style={{ fontSize: "13px", color: "#bbb", lineHeight: 1.6 }}>
                Select a book above and click
                <br />
                <strong style={{ color: "#888" }}>Get Recommendations</strong>
              </p>
            </div>
          ) : (
            <div
              style={{
                background: "white",
                borderRadius: "14px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                padding: "16px",
                display: "flex",
                gap: "14px",
              }}
            >
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: "white",
                    borderRadius: "16px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
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
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      padding: "14px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#1a1a1a",
                        margin: "0 0 3px",
                        lineHeight: 1.3,
                      }}
                    >
                      {rec.title}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#999",
                        margin: "0 0 8px",
                      }}
                    >
                      {rec.authors}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        lineHeight: 1.5,
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
                        border: "1px solid #e0dbd3",
                        borderRadius: "8px",
                        padding: "7px 10px",
                        fontSize: "12px",
                        color: "#555",
                        background: "white",
                        marginBottom: "10px",
                        outline: "none",
                      }}
                    >
                      {lists.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleAddToList(rec, i)}
                        style={{
                          flex: 1,
                          background: "#4f6ef7",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 0",
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
                          color: "#777",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 0",
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
    </PageContainer>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";

const MOCK_LISTS = [
  {
    id: 1,
    name: "Want to Read",
    open: false,
    books: [
      { id: 1, title: "The Name of the Wind", author: "Patrick Rothfuss", cover: "https://covers.openlibrary.org/b/isbn/9780756404741-M.jpg" },
      { id: 2, title: "Piranesi", author: "Susanna Clarke", cover: "https://covers.openlibrary.org/b/isbn/9781526622426-M.jpg" },
    ],
  },
  {
    id: 2,
    name: "Sci-Fi Picks",
    open: false,
    books: [
      { id: 5, title: "The Expanse", author: "James S.A. Corey", cover: "https://covers.openlibrary.org/b/isbn/9780316129084-M.jpg" },
    ],
  },
  {
    id: 3,
    name: "Finished Books",
    open: true,
    books: [
      { id: 3, title: "Neuromancer", author: "William Gibson", cover: "https://covers.openlibrary.org/b/isbn/9780441569595-M.jpg" },
      { id: 4, title: "Snow Crash", author: "Neal Stephenson", cover: "https://covers.openlibrary.org/b/isbn/9780553380958-M.jpg" },
      { id: 6, title: "Dune", author: "Frank Herbert", cover: "https://covers.openlibrary.org/b/isbn/9780441013593-M.jpg" },
    ],
  },
];

const MOCK_RECOMMENDATIONS = [
  {
    id: 1,
    title: "Altered Carbon",
    author: "Richard K. Morgan",
    cover: "https://covers.openlibrary.org/b/isbn/9780345457684-M.jpg",
    reason: "A gripping cyberpunk thriller you'll love",
  },
  {
    id: 2,
    title: "Foundation",
    author: "Isaac Asimov",
    cover: "https://covers.openlibrary.org/b/isbn/9780553293357-M.jpg",
    reason: "A sci-fi classic with epic world-building",
  },
];

export default function Dashboard() {
  const [lists, setLists] = useState(MOCK_LISTS);
  const [recommendations, setRecommendations] = useState(MOCK_RECOMMENDATIONS);
  const [newListName, setNewListName] = useState("");
  const [showNewListInput, setShowNewListInput] = useState(false);
  const [movingBook, setMovingBook] = useState(null);

  const totalBooks = lists.reduce((sum, l) => sum + l.books.length, 0);
  const currentlyReading = lists.find((l) => l.name === "Finished Books")?.books.at(-1)?.title ?? "—";

  function toggleList(id) {
    setLists(lists.map((l) => l.id === id ? { ...l, open: !l.open } : l));
  }

  function handleCreateList() {
    if (!newListName.trim()) return;
    setLists([...lists, { id: lists.length + 100, name: newListName.trim(), open: false, books: [] }]);
    setNewListName("");
    setShowNewListInput(false);
  }

  function handleDeleteList(listId) {
    setLists(lists.filter((l) => l.id !== listId));
  }

  function handleRemoveBook(listId, bookId) {
    setLists(lists.map((l) =>
      l.id === listId ? { ...l, books: l.books.filter((b) => b.id !== bookId) } : l
    ));
  }

  function handleMoveBook(targetListId) {
    if (!movingBook) return;
    const { book, fromListId } = movingBook;
    setLists(lists.map((l) => {
      if (l.id === fromListId) return { ...l, books: l.books.filter((b) => b.id !== book.id) };
      if (l.id === targetListId) return { ...l, books: [...l.books, book] };
      return l;
    }));
    setMovingBook(null);
  }

  function handleAddRecommendation(rec) {
    const targetList = lists[0];
    if (!targetList) return;
    const newBook = { id: rec.id + 1000, title: rec.title, author: rec.author, cover: rec.cover };
    setLists(lists.map((l) =>
      l.id === targetList.id ? { ...l, books: [...l.books, newBook] } : l
    ));
    setRecommendations(recommendations.filter((r) => r.id !== rec.id));
  }

  function handleDismiss(id) {
    setRecommendations(recommendations.filter((r) => r.id !== id));
  }

  return (
    <div style={{ backgroundColor: "#f7f3ee", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px 64px" }}>

        {/* Stats strip */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
          background: "white",
          borderRadius: "0 0 16px 16px",
          padding: "14px 28px",
          marginBottom: "40px",
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          fontSize: "14px",
          color: "#555",
        }}>
          <span>Total Books: <strong style={{ color: "#1a1a1a" }}>{totalBooks}</strong></span>
          <span style={{ color: "#ddd" }}>|</span>
          <span>Reading Lists: <strong style={{ color: "#1a1a1a" }}>{lists.length}</strong></span>
          <span style={{ color: "#ddd" }}>|</span>
          <span>Currently Reading: <strong style={{ color: "#1a1a1a" }}>{currentlyReading}</strong></span>
          <span style={{ marginLeft: "auto", fontSize: "20px" }}>📖</span>
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", alignItems: "start" }}>

          {/* LEFT — Reading Lists */}
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a", marginBottom: "20px" }}>
              Your Reading Lists
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {lists.map((list) => (
                <div key={list.id} style={{
                  background: "white",
                  borderRadius: "14px",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                  overflow: "hidden",
                }}>

                  {/* List header row */}
                  <button
                    onClick={() => toggleList(list.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: "15px", fontWeight: 600, color: "#1a1a1a" }}>
                      {list.name} ({list.books.length})
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span
                        onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }}
                        style={{ fontSize: "12px", color: "#bbb", cursor: "pointer" }}
                        onMouseEnter={(e) => e.target.style.color = "#e57373"}
                        onMouseLeave={(e) => e.target.style.color = "#bbb"}
                      >
                        Delete
                      </span>
                      <span style={{
                        fontSize: "11px",
                        color: "#aaa",
                        transform: list.open ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                        display: "inline-block",
                      }}>▼</span>
                    </div>
                  </button>

                  {/* Books */}
                  {list.open && (
                    <div style={{ borderTop: "1px solid #f0ece6" }}>
                      {list.books.length === 0 ? (
                        <p style={{ padding: "14px 20px", fontSize: "13px", color: "#bbb" }}>No books yet.</p>
                      ) : (
                        list.books.map((book) => (
                          <div key={book.id} style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 20px",
                            borderBottom: "1px solid #f7f3ee",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                              <img
                                src={book.cover}
                                alt={book.title}
                                style={{ width: "36px", height: "52px", objectFit: "cover", borderRadius: "5px", flexShrink: 0 }}
                              />
                              <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {book.title}
                                </p>
                                <p style={{ fontSize: "12px", color: "#999", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {book.author}
                                </p>
                              </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, marginLeft: "16px" }}>
                              {movingBook?.book.id === book.id ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                  <span style={{ fontSize: "12px", color: "#999" }}>Move to:</span>
                                  {lists.filter((l) => l.id !== list.id).map((target) => (
                                    <button key={target.id} onClick={() => handleMoveBook(target.id)} style={{
                                      fontSize: "11px", padding: "3px 8px", background: "#eef2ff", color: "#4f6ef7",
                                      border: "1px solid #c7d2fe", borderRadius: "6px", cursor: "pointer",
                                    }}>
                                      {target.name}
                                    </button>
                                  ))}
                                  <button onClick={() => setMovingBook(null)} style={{ fontSize: "12px", color: "#bbb", background: "none", border: "none", cursor: "pointer" }}>✕</button>
                                </div>
                              ) : (
                                <button onClick={() => setMovingBook({ book, fromListId: list.id })} style={{
                                  fontSize: "12px", padding: "5px 14px",
                                  background: "white", border: "1px solid #e0dbd3",
                                  borderRadius: "7px", cursor: "pointer", color: "#555",
                                  fontWeight: 500,
                                }}>
                                  Move
                                </button>
                              )}
                              <button onClick={() => handleRemoveBook(list.id, book.id)} style={{
                                fontSize: "12px", padding: "5px 14px",
                                background: "white", border: "1px solid #e0dbd3",
                                borderRadius: "7px", cursor: "pointer", color: "#555",
                                fontWeight: 500,
                              }}>
                                Remove
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* New list input */}
              {showNewListInput ? (
                <div style={{
                  background: "white", borderRadius: "14px", padding: "14px 20px",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <input
                    autoFocus
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
                    placeholder="List name…"
                    style={{
                      flex: 1, border: "none", outline: "none", fontSize: "14px",
                      color: "#1a1a1a", background: "transparent",
                    }}
                  />
                  <button onClick={handleCreateList} style={{
                    background: "#4f6ef7", color: "white", border: "none",
                    borderRadius: "8px", padding: "6px 14px", fontSize: "13px",
                    fontWeight: 600, cursor: "pointer",
                  }}>Create</button>
                  <button onClick={() => setShowNewListInput(false)} style={{
                    background: "none", border: "none", color: "#bbb",
                    fontSize: "13px", cursor: "pointer",
                  }}>Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewListInput(true)}
                  style={{
                    background: "white", border: "2px dashed #ddd", borderRadius: "14px",
                    padding: "14px 20px", fontSize: "14px", color: "#999", cursor: "pointer",
                    textAlign: "left", fontWeight: 500,
                  }}
                >
                  + Create New List
                </button>
              )}
            </div>

            {/* Empty state */}
            {lists.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <p style={{ fontSize: "16px", fontWeight: 600, color: "#444", marginBottom: "8px" }}>
                  No lists yet. Start your book journey!
                </p>
                <Link to="/search" style={{
                  display: "inline-block", marginTop: "8px",
                  background: "#4f6ef7", color: "white",
                  padding: "10px 28px", borderRadius: "10px",
                  fontSize: "14px", fontWeight: 600, textDecoration: "none",
                }}>
                  Search for Books
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT — AI Recommendations */}
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a", marginBottom: "20px" }}>
              AI Recommendations for You
            </h2>

            {recommendations.length === 0 ? (
              <div style={{
                background: "white", borderRadius: "14px", padding: "40px 20px",
                textAlign: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}>
                <p style={{ fontSize: "14px", color: "#aaa", marginBottom: "12px" }}>
                  No recommendations right now.
                </p>
                <Link to="/search" style={{ fontSize: "13px", color: "#4f6ef7", textDecoration: "none", fontWeight: 500 }}>
                  Run a search to get new ones
                </Link>
              </div>
            ) : (
              <div style={{
                background: "white", borderRadius: "14px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                padding: "16px", display: "flex", gap: "14px",
              }}>
                {recommendations.map((rec) => (
                  <div key={rec.id} style={{
                    flex: 1,
                    background: "white",
                    borderRadius: "16px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}>
                    <img
                      src={rec.cover}
                      alt={rec.title}
                      style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    />
                    <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px", lineHeight: 1.3 }}>
                        {rec.title}
                      </p>
                      <p style={{ fontSize: "12px", color: "#999", margin: "0 0 8px" }}>{rec.author}</p>
                      <p style={{ fontSize: "12px", color: "#666", lineHeight: 1.5, margin: "0 0 14px", flex: 1 }}>
                        {rec.reason}
                      </p>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleAddRecommendation(rec)}
                          style={{
                            flex: 1, background: "#4f6ef7", color: "white",
                            border: "none", borderRadius: "8px", padding: "8px 0",
                            fontSize: "12px", fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          Add to List
                        </button>
                        <button
                          onClick={() => handleDismiss(rec.id)}
                          style={{
                            flex: 1, background: "#f2ede6", color: "#777",
                            border: "none", borderRadius: "8px", padding: "8px 0",
                            fontSize: "12px", fontWeight: 500, cursor: "pointer",
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

        {/* Bottom empty state when no lists */}
        {lists.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <p style={{ fontSize: "16px", color: "#888", marginBottom: "16px" }}>
              No lists yet. Start your book journey!
            </p>
            <Link to="/search" style={{
              display: "inline-block",
              background: "#4f6ef7", color: "white",
              padding: "12px 32px", borderRadius: "10px",
              fontSize: "14px", fontWeight: 600, textDecoration: "none",
            }}>
              Search for Books
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

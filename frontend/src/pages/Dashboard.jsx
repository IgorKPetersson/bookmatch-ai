import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const sectionLabelStyle = {
    fontSize: "12px",
    fontWeight: 700,
    color: "#3f3a34",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: "0 0 14px",
  };

  const [lists, setLists] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountEmail, setAccountEmail] = useState("");
  const [accountName, setAccountName] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const selectedBookRef = useRef(null);

  const recentlyAdded = lists
    .flatMap((l) => l.books.map((b) => ({ ...b, listName: l.name })))
    .sort((a, b) => (a.id || 0) - (b.id || 0)) // use book id as recency proxy
    .slice(-2)
    .reverse();
  const [newListName, setNewListName] = useState("");
  const [showNewListInput, setShowNewListInput] = useState(false);
  const [movingBook, setMovingBook] = useState(null);

  const totalBooks = lists.reduce((sum, l) => sum + l.books.length, 0);
  const currentlyReading =
    lists.find((l) => l.name === "Finished Books")?.books.at(-1)?.title ?? "—";
  const accountInitial = accountEmail ? accountEmail[0].toUpperCase() : "?";
  const avatarSeeds = Array.from({ length: 36 }, (_, index) =>
    `${accountEmail || "bookmatch-user"}-${index + 1}`,
  );

  function getAvatarUrl(seed) {
    return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(seed)}`;
  }

  function toggleList(id) {
    setLists(lists.map((l) => (l.id === id ? { ...l, open: !l.open } : l)));
  }

  function handleCreateList() {
    if (!newListName.trim()) return;
    fetch(import.meta.env.VITE_API_URL + "/booklists", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newListName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLists([
          ...lists,
          {
            id: data.id,
            name: data.name,
            open: false,
            books: [],
          },
        ]);
        setNewListName("");
        setShowNewListInput(false);
      });
  }

  function handleDeleteList(listId) {
    fetch(`${import.meta.env.VITE_API_URL}/booklists/${listId}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() => setLists(lists.filter((l) => l.id !== listId)));
  }

  function handleRemoveBook(listId, bookId) {
    fetch(`${import.meta.env.VITE_API_URL}/booklists/${listId}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() => {
      setLists(
        lists.map((l) =>
          l.id === listId
            ? { ...l, books: l.books.filter((b) => b.id !== bookId) }
            : l,
        ),
      );

      if (selectedBook?.id === bookId) {
        setSelectedBook(null);
        setShowFullDescription(false);
      }
    });
  }

  function handleMoveBook(targetListId) {
    if (!movingBook) return;
    const { book, fromListId } = movingBook;
    fetch(`${import.meta.env.VITE_API_URL}/booklists/${fromListId}/books/${book.id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() =>
        fetch(`${import.meta.env.VITE_API_URL}/booklists/${targetListId}/books`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/JSON" },
          body: JSON.stringify({ book_id: book.id }),
        }),
      )
      .then(() => {
        setLists(
          lists.map((l) => {
            if (l.id === fromListId)
              return { ...l, books: l.books.filter((b) => b.id !== book.id) };
            if (l.id === targetListId)
              return { ...l, books: [...l.books, book] };
            return l;
          }),
        );
        setMovingBook(null);
      });
  }

  async function handleLogout() {
    await fetch(import.meta.env.VITE_API_URL + "/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/";
  }

  async function handleSaveAvatar(seed) {
    if (!seed) {
      return;
    }

    try {
      setSavingAvatar(true);
      const res = await fetch(import.meta.env.VITE_API_URL + "/me/avatar", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_seed: seed }),
      });

      if (!res.ok) {
        throw new Error("Could not save avatar");
      }

      const data = await res.json();
      setAvatarSeed(data.avatar_seed || seed);
      setShowAvatarPicker(false);
    } catch {
      alert("Could not save avatar right now.");
    } finally {
      setSavingAvatar(false);
    }
  }

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/booklists", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not load booklists");
        }

        return res.json();
      })
      .then((data) => {
        setLists(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setLists([]);
      });
  }, []);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        return res.json();
      })
      .then((data) => {
        setIsAuthenticated(true);
        setAccountEmail(data?.email || "");
        setAccountName(
          data?.full_name ||
            data?.email?.split("@")[0] ||
            "Personal BookMatch account",
        );
        setAvatarSeed(data?.avatar_seed || "");

      })
      .catch(() => {
        setIsAuthenticated(false);
        setAccountEmail("");
        setAccountName("");
        setAvatarSeed("");
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []);

  useEffect(() => {
    if (selectedBook && selectedBookRef.current) {
      const top = selectedBookRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(top - 120, 0),
        behavior: "smooth",
      });
    }
  }, [selectedBook]);

  if (authChecked && !isAuthenticated) {
    return (
      <div style={{ backgroundColor: "#f7f3ee", minHeight: "100vh" }}>
        <div
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            padding: "80px 32px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              padding: "42px 36px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#8d7f70",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 10px",
              }}
            >
              Dashboard Access
            </p>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#1a1a1a",
                margin: "0 0 12px",
              }}
            >
              Log in to access your dashboard
            </h1>
            <p
              style={{
                maxWidth: "560px",
                margin: "0 auto 24px",
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#5f574f",
              }}
            >
              Save books, organize your reading lists, choose your profile
              avatar, and keep your personal BookMatch space in one place.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/auth"
                style={{
                  background: "#4f6ef7",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Log in
              </Link>
              <Link
                to="/search"
                style={{
                  background: "white",
                  color: "#5f574f",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid #e0dbd3",
                }}
              >
                Search Books
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f7f3ee", minHeight: "100vh" }}>
      <div className="dashboard-container">
        {/* Stats strip */}
        <div
          className="dashboard-stats"
          style={{
            background: "white",
            borderRadius: "0 0 16px 16px",
            padding: "14px 28px",
            marginBottom: "40px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          }}
        >
          <span>
            Total Books:{" "}
            <strong style={{ color: "#1a1a1a" }}>{totalBooks}</strong>
          </span>
          <span className="dashboard-divider">|</span>
          <span>
            Reading Lists:{" "}
            <strong style={{ color: "#1a1a1a" }}>{lists.length}</strong>
          </span>
          <span className="dashboard-divider">|</span>
          <span>
            Latest Book Read:{" "}
            <strong style={{ color: "#1a1a1a" }}>{currentlyReading}</strong>
          </span>
          <span className="dashboard-stat-icon" style={{ fontSize: "20px" }}>
            📖
          </span>
        </div>

        {/* Main grid */}
        <div
          className="dashboard-grid"
        >
          {/* LEFT — Reading Lists */}
          <div>
            <div
              style={{
                background: "white",
                borderRadius: "14px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                padding: "18px",
                marginBottom: "28px",
              }}
            >
              <p style={sectionLabelStyle}>Account Overview</p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "16px",
                }}
              >
                <div
                  onClick={() => {
                    setShowAvatarPicker(true);
                  }}
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "999px",
                    background: "#eef2ff",
                    color: "#4f6ef7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: 700,
                    flexShrink: 0,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  {avatarSeed ? (
                    <img
                      src={getAvatarUrl(avatarSeed)}
                      alt="Selected avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    accountInitial
                  )}
                </div>

                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      margin: "0 0 4px",
                    }}
                  >
                    {accountEmail || "Logged-in user"}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#8d7f70",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {accountName}
                  </p>
                </div>
              </div>

              <p
                style={{
                  fontSize: "13px",
                  color: "#5f574f",
                  lineHeight: 1.6,
                  margin: "0 0 14px",
                }}
              >
                Manage your reading space, explore saved books, and keep your
                personal lists organized in one place.
              </p>

              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  background: "white",
                  border: "1px solid #e0dbd3",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#5f574f",
                  cursor: "pointer",
                }}
              >
                Log out
              </button>

              {showAvatarPicker && (
                <div
                  style={{
                    marginTop: "16px",
                    paddingTop: "16px",
                    borderTop: "1px solid #f0ece6",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#8d7f70",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      margin: "0 0 12px",
                    }}
                  >
                    Choose Your Avatar
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(12, 1fr)",
                      gap: "10px",
                      marginBottom: "14px",
                    }}
                  >
                    {avatarSeeds.map((seed) => (
                      <button
                        key={seed}
                        onClick={() => handleSaveAvatar(seed)}
                        disabled={savingAvatar}
                        style={{
                          width: "100%",
                          height: "36px",
                          borderRadius: "10px",
                          border:
                            avatarSeed === seed
                              ? "2px solid #4f6ef7"
                              : "1px solid #e0dbd3",
                          background: "#f8f4ee",
                          padding: "3px",
                          cursor: savingAvatar ? "not-allowed" : "pointer",
                          opacity: savingAvatar ? 0.7 : 1,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={getAvatarUrl(seed)}
                          alt="Avatar option"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "7px",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "14px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                padding: "18px",
              }}
            >
              <p style={sectionLabelStyle}>Reading Lists</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
              {[...lists]
                .sort((a, b) => {
                  if (a.name === "Want to Read") return -1;
                  if (b.name === "Want to Read") return 1;
                  if (a.name === "Finished Books") return 1;
                  if (b.name === "Finished Books") return -1;

                  return a.name.localeCompare(b.name);
                })
                .map((list) => (
                  <div
                    key={list.id}
                    style={{
                      background: "white",
                      borderRadius: "14px",
                      boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                      overflow: "hidden",
                    }}
                  >
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
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#1a1a1a",
                        }}
                      >
                        {list.name} ({list.books.length})
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        {!list.is_protected && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteList(list.id);
                            }}
                            style={{
                              fontSize: "12px",
                              color: "#bbb",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.color = "#e57373")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.color = "#bbb")
                            }
                          >
                            Delete
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#aaa",
                            transform: list.open
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.2s",
                            display: "inline-block",
                          }}
                        >
                          ▼
                        </span>
                      </div>
                    </button>

                    {/* Books */}
                    {list.open && (
                      <div style={{ borderTop: "1px solid #f0ece6" }}>
                        {list.books.length === 0 ? (
                          <p
                            style={{
                              padding: "14px 20px",
                              fontSize: "13px",
                              color: "#bbb",
                            }}
                          >
                            No books yet.
                          </p>
                        ) : (
                          list.books.map((book) => (
                            <div
                              key={book.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 20px",
                                borderBottom: "1px solid #f7f3ee",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                  minWidth: 0,
                                }}
                              >
                                <button
                                  onClick={() =>
                                    {
                                      setSelectedBook({
                                        ...book,
                                        listName: list.name,
                                      });
                                      setShowFullDescription(false);
                                    }
                                  }
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    minWidth: 0,
                                    flex: 1,
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    textAlign: "left",
                                    cursor: "pointer",
                                  }}
                                >
                                  <img
                                    src={book.image}
                                    alt={book.title}
                                    style={{
                                      width: "36px",
                                      height: "52px",
                                      objectFit: "cover",
                                      borderRadius: "5px",
                                      flexShrink: 0,
                                    }}
                                  />
                                  <div style={{ minWidth: 0 }}>
                                    <p
                                      style={{
                                        fontSize: "14px",
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
                                        margin: "2px 0 0",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {book.authors}
                                    </p>
                                  </div>
                                </button>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  flexShrink: 0,
                                  marginLeft: "16px",
                                }}
                              >
                                {movingBook?.book.id === book.id ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "#999",
                                      }}
                                    >
                                      Move to:
                                    </span>
                                    {lists
                                      .filter((l) => l.id !== list.id)
                                      .map((target) => (
                                        <button
                                          key={target.id}
                                          onClick={() =>
                                            handleMoveBook(target.id)
                                          }
                                          style={{
                                            fontSize: "11px",
                                            padding: "3px 8px",
                                            background: "#eef2ff",
                                            color: "#4f6ef7",
                                            border: "1px solid #c7d2fe",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          {target.name}
                                        </button>
                                      ))}
                                    <button
                                      onClick={() => setMovingBook(null)}
                                      style={{
                                        fontSize: "12px",
                                        color: "#bbb",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                      }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() =>
                                      setMovingBook({
                                        book,
                                        fromListId: list.id,
                                      })
                                    }
                                    style={{
                                      fontSize: "12px",
                                      padding: "5px 14px",
                                      background: "white",
                                      border: "1px solid #e0dbd3",
                                      borderRadius: "7px",
                                      cursor: "pointer",
                                      color: "#555",
                                      fontWeight: 500,
                                    }}
                                  >
                                    Move
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    handleRemoveBook(list.id, book.id)
                                  }
                                  style={{
                                    fontSize: "12px",
                                    padding: "5px 14px",
                                    background: "white",
                                    border: "1px solid #e0dbd3",
                                    borderRadius: "7px",
                                    cursor: "pointer",
                                    color: "#555",
                                    fontWeight: 500,
                                  }}
                                >
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
                <div
                  style={{
                    background: "white",
                    borderRadius: "14px",
                    padding: "14px 20px",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    autoFocus
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
                    placeholder="List name…"
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      fontSize: "14px",
                      color: "#1a1a1a",
                      background: "transparent",
                    }}
                  />
                  <button
                    onClick={handleCreateList}
                    style={{
                      background: "#4f6ef7",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "6px 14px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewListInput(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#bbb",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewListInput(true)}
                  style={{
                    background: "white",
                    border: "2px dashed #ddd",
                    borderRadius: "14px",
                    padding: "14px 20px",
                    fontSize: "14px",
                    color: "#999",
                    cursor: "pointer",
                    textAlign: "left",
                    fontWeight: 500,
                  }}
                >
                  + Create New List
                </button>
              )}
              </div>
            </div>

            {/* Empty state */}
            {lists.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#444",
                    marginBottom: "8px",
                  }}
                >
                  No lists yet. Start your book journey!
                </p>
                <Link
                  to="/search"
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    background: "#4f6ef7",
                    color: "white",
                    padding: "10px 28px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Search for Books
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT — Recently Saved */}
          <div>
            {recentlyAdded.length === 0 ? (
              <div
                style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "40px 20px",
                  textAlign: "center",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                }}
              >
                <p style={sectionLabelStyle}>Recently Added</p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#aaa",
                    marginBottom: "12px",
                  }}
                >
                  No books saved yet.
                </p>
                <Link
                  to="/search"
                  style={{
                    fontSize: "13px",
                    color: "#4f6ef7",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Search for books
                </Link>
              </div>
            ) : (
              <div
                style={{
                  background: "white",
                  borderRadius: "14px",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  marginBottom: "28px",
                }}
              >
                <p style={sectionLabelStyle}>Recently Added</p>
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                  }}
                >
                  {recentlyAdded.map((book) => (
                    <div
                      key={book.id}
                      className="dash-book-card"
                      style={{
                        flex: 1,
                        background: "white",
                        borderRadius: "16px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <img
                        src={book.image}
                        alt={book.title}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          padding: "14px 14px 16px",
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
                            margin: "0 0 4px",
                            lineHeight: 1.3,
                          }}
                        >
                          {book.title}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#999",
                            margin: "0 0 8px",
                          }}
                        >
                          {book.authors}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#b5a99a",
                            lineHeight: 1.5,
                            margin: "0 0 14px",
                            flex: 1,
                          }}
                        >
                          {book.listName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recentlyAdded.length === 0 ? (
              <div
                style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "40px 20px",
                  textAlign: "center",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                  marginBottom: "28px",
                }}
              >
                <p style={sectionLabelStyle}>Selected Book</p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#aaa",
                    marginBottom: "12px",
                  }}
                >
                  No books saved yet.
                </p>
                <Link
                  to="/search"
                  style={{
                    fontSize: "13px",
                    color: "#4f6ef7",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Search for books
                </Link>
              </div>
            ) : !selectedBook ? (
              <div
                style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "40px 20px",
                  textAlign: "center",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                }}
              >
                <p style={sectionLabelStyle}>Selected Book</p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#8d7f70",
                    margin: 0,
                  }}
                >
                  Select a saved book to view details.
                </p>
              </div>
            ) : (
              <div
                ref={selectedBookRef}
                className="dash-book-card"
                style={{
                  background: "white",
                  borderRadius: "14px",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "18px 18px 0" }}>
                  <p style={sectionLabelStyle}>Selected Book</p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: "18px",
                    padding: "18px",
                  }}
                >
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    style={{
                      width: "120px",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />

                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#1a1a1a",
                        margin: "0 0 6px",
                        lineHeight: 1.2,
                      }}
                    >
                      {selectedBook.title}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#5f574f",
                        margin: "0 0 16px",
                      }}
                    >
                      {selectedBook.authors}
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gap: "10px",
                        fontSize: "13px",
                        color: "#5f574f",
                      }}
                    >
                      <p style={{ margin: 0 }}>
                        <strong style={{ color: "#1a1a1a" }}>Genre:</strong>{" "}
                        {selectedBook.genre || "Unknown"}
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong style={{ color: "#1a1a1a" }}>
                          Release Year:
                        </strong>{" "}
                        {selectedBook.release_year || "Unknown"}
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong style={{ color: "#1a1a1a" }}>List:</strong>{" "}
                        {selectedBook.listName}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #f0ece6",
                    padding: "18px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#8d7f70",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      margin: "0 0 8px",
                    }}
                  >
                    Short Description
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#5f574f",
                      lineHeight: 1.6,
                      margin: 0,
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: showFullDescription ? "unset" : 5,
                      overflow: showFullDescription ? "visible" : "hidden",
                    }}
                  >
                    {selectedBook.short_description ||
                      "No description is available for this book yet."}
                  </p>
                  {selectedBook.short_description && (
                    <button
                      onClick={() =>
                        setShowFullDescription((prev) => !prev)
                      }
                      style={{
                        marginTop: "10px",
                        background: "none",
                        border: "none",
                        color: "#4f6ef7",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      {showFullDescription ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom empty state when no lists */}
        {lists.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <p
              style={{
                fontSize: "16px",
                color: "#888",
                marginBottom: "16px",
              }}
            >
              No lists yet. Start your book journey!
            </p>
            <Link
              to="/search"
              style={{
                display: "inline-block",
                background: "#4f6ef7",
                color: "white",
                padding: "12px 32px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Search for Books
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [newListName, setNewListName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
      return;
    }

    fetchBooks(token);
  }, []);

  async function fetchBooks(token) {
    try {
      const res = await fetch("http://localhost:8000/booklists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        navigate("/auth");
        return;
      }

      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

async function handleCreateBooklist() {
  const token = localStorage.getItem("token");
  if (!token || !newListName) return;

  try {
    const res = await fetch("http://localhost:8000/booklists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newListName }),
    });

    if (!res.ok) {
      console.error("Failed to create booklist");
      return;
    }

    const newBooklist = await res.json();
    setBooks([...books, newBooklist]);
    setNewListName(""); // rensa inputfältet
  } catch (err) {
    console.error(err);
  }
}

  return (
  <div>
    <h1>Dashboard</h1>

    <button
      onClick={() => {
        localStorage.removeItem("token");
        navigate("/auth");
      }}
    >
      Logout
    </button>
    <input type="text" placeholder="New booklist name" value={newListName} onChange={(e) => setNewListName(e.target.value)} />
    <button onClick={handleCreateBooklist}>Create Booklist</button>

    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.name}</li>
      ))}
    </ul>
  </div>
);
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [newListName, setNewListName] = useState("");
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [isbn, setIsbn] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {


    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      const res = await fetch("http://localhost:8000/books", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
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

function handleCreateBooklist() {
  console.log("Create booklist clicked");
}
async function handleAddBook() {

  try {
    const res = await fetch("http://localhost:8000/books", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",

      },
      body: JSON.stringify({
        title: title,
        authors: authors,
        short_description: shortDescription,
        isbn: isbn,
        release_year: Number(releaseYear),
        genre: genre,
      }),
    });

    fetchBooks();

    const data = await res.json();
    console.log("Book created:", data);
    fetchBooks(token);
    setTitle("");
    setAuthors("");
    setShortDescription("");
    setIsbn("");
    setReleaseYear("");
    setGenre("");
  } catch (err) {
    console.error(err);
  }
}

async function handleDeleteBook(bookId) {

  try {
    const res = await fetch(`http://localhost:8000/books/${bookId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
      },
    });

    if (res.ok) {
      fetchBooks();
    }
  } catch (err) {
    console.error(err);
  }
}

async function handleEditBook(book) {

  const newTitle = prompt("Enter new title:", book.title);

  if (!newTitle) return;

  try {
    const res = await fetch(`http://localhost:8000/books/${book.id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
              },
      body: JSON.stringify({
        title: newTitle,
        authors: book.authors,
        short_description: book.short_description,
        isbn: book.isbn,
        release_year: book.release_year,
        genre: book.genre,
      }),
    });

    if (res.ok) {
      fetchBooks();
    }
  } catch (err) {
    console.error(err);
  }
}

  return (
  <div>
    <h1>Dashboard</h1>
    <div className="mb-6">
  <h2 className="text-xl mb-2">Add Book</h2>

  <input
    className="border p-2 mr-2"
    placeholder="Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />

  <input
    className="border p-2 mr-2"
    placeholder="Author"
    value={authors}
    onChange={(e) => setAuthors(e.target.value)}
  />

  <button
    className="bg-blue-500 text-white px-4 py-2"
    onClick={handleAddBook}
  >
    Add Book
  </button>

</div>

    <button
      onClick={async () => {
        await fetch("http://localhost:8000/logout", {
          method: "POST",
          credentials: "include"
        });
        navigate("/auth");
      }}
    >
      Logout
    </button>

    <input type="text" placeholder="New booklist name" value={newListName} onChange={(e) => setNewListName(e.target.value)} />
    <button onClick={handleCreateBooklist}>Create Booklist</button>
    {books.length === 0 && <p>No books yet.</p>}

    <ul>
      {books.map((book) => (
        <li key={book.id} style={{ marginBottom: "10px" }}>
          <strong>{book.title}</strong> – {book.authors} ({book.release_year})

          <button
            onClick={() => handleEditBook(book)}
            style={{ marginLeft: "10px" }}
          >
            Edit
          </button>

          <button
            onClick={() => handleDeleteBook(book.id)}
            style={{ marginLeft: "5px" }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  </div>
);
}



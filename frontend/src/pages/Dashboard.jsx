import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [isbn, setIsbn] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [genre, setGenre] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:8000/books", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
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
  };

  useEffect(() => {
    fetchBooks();
    setMessage("Book added successfully!");
  }, []);

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

      const data = await res.json();
      console.log("Book created:", data);

      fetchBooks();

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
      });

      if (res.ok) {
      setMessage("Book deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
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
    <PageContainer>

      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>
      {message && (
        <div className="mb-6 p-3 rounded-lg bg-green-100 border border-green-300 text-green-700">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">

        {/* Add Book Panel */}

        <div className="bg-white p-6 rounded-xl shadow-md">

          <h2 className="text-xl font-semibold mb-4">
            Add Book
          </h2>

          <div className="space-y-3">

            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Author"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
            />

            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />

            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />

            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Release Year"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
            />

            <textarea
              className="border rounded px-3 py-2 w-full"
              placeholder="Short description"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
              onClick={handleAddBook}
            >
              Add Book
            </button>

          </div>

        </div>


        {/* Book List Panel */}

        <div className="bg-white p-6 rounded-xl shadow-md">

          <h2 className="text-xl font-semibold mb-4">
            Your Books
          </h2>

          {books.length === 0 && (
            <p className="text-gray-500">
              No books yet.
            </p>
          )}

          <ul className="space-y-4">

            {books.map((book) => (

              <li
                key={book.id}
                className="flex justify-between items-center border-b pb-3"
              >

                <div>

                  <p className="font-semibold">
                    {book.title}
                  </p>

                  <p className="text-sm text-gray-500">
                    {book.authors} ({book.release_year})
                  </p>

                </div>

                <div className="flex gap-3">

                  <button
                    onClick={() => handleEditBook(book)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>

                </div>

              </li>

            ))}

          </ul>

        </div>

      </div>

      <div className="mt-10">

        <button
          onClick={async () => {
            await fetch("http://localhost:8000/logout", {
              method: "POST",
              credentials: "include",
            });
            navigate("/auth");
          }}
          className="text-red-600 hover:underline"
        >
          Logout
        </button>

      </div>

    </PageContainer>
  );
}
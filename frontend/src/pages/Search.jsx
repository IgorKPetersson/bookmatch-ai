import PageContainer from "../components/PageContainer";
import React, { useState } from "react";
import BookCard from "../components/BookCard";
import { Link } from "react-router-dom";

export default function Search() {

  const [book1, setBook1] = useState("");
  const [book2, setBook2] = useState("");
  const [book3, setBook3] = useState("");
  const [genre, setGenre] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [needsLogin, setNeedsLogin] = useState(false);

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

      {/* Search Section */}

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

          <input
            type="text"
            placeholder="Book 2"
            className="border rounded px-3 py-2"
            onChange={(e) => setBook2(e.target.value)}
          />

          <input
            type="text"
            placeholder="Book 3"
            className="border rounded px-3 py-2"
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

      {/* Status messages */}

      {loading && <p>Fetching books...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {needsLogin && <Link to="/auth">Please log in</Link>}

      {/* Recommendations Grid */}

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

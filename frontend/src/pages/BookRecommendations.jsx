import React, { useState } from "react";
import BookCard from "../components/BookCard";

export default function BookRecommendations() {
  const [book1, setBook1] = useState("");
  const [book2, setBook2] = useState("");
  const [book3, setBook3] = useState("");
  const [genre, setGenre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  async function handleSubmit(e) {
    try {
      setLoading(true);
      setError("");
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
      } else {
        setError("Something went wrong.");
      }
    } catch {
      setError("Could not fetch book recommendations...");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <div>
        {loading && <p>"Fetching books..."</p>}
        {error && <p>{error}</p>}
        {recommendations.map((rec, index) => (
          <BookCard
            key={index}
            title={rec.title}
            author={rec.author}
            reason={rec.reason}
          />
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Book-1"
          onChange={(e) => setBook1(e.target.value)}
        />
        <input
          type="text"
          placeholder="Book-2"
          onChange={(e) => setBook2(e.target.value)}
        />
        <input
          type="text"
          placeholder="Book-3"
          onChange={(e) => setBook3(e.target.value)}
        />
        <input
          type="text"
          placeholder="Genre"
          onChange={(e) => setGenre(e.target.value)}
        />
        <button onClick={handleSubmit}>SUBMIT</button>
      </div>
    </div>
  );
}

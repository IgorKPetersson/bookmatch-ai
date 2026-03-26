import { Link } from "react-router-dom";
import React from "react";
import BookCard from "../components/BookCard";

export default function Index() {
  const pageBackground = "#f7f3ee";
  const cardBackground = "#ffffff";
  const textPrimary = "#1a1a1a";
  const textSecondary = "#5f574f";
  const textMuted = "#8d7f70";
  const borderColor = "#e0dbd3";
  const dividerColor = "#f0ece6";
  const accent = "#4f6ef7";
  const accentSoft = "#eef2ff";
  const accentBorder = "#c7d2fe";
  const shadow = "0 1px 6px rgba(0,0,0,0.06)";

  const heroBooks = [
    {
      title: "The Lies of Locke Lamora",
      authors: "Scott Lynch",
      description: "A thrilling fantasy heist story set in a city of thieves.",
      genre: "Fantasy",
      release_date: "2006",
      isbn: "9780553588941",
      image: "https://covers.openlibrary.org/b/isbn/9780553588941-L.jpg",
      reason: "Recommended because you liked The Name of the Wind",
    },
    {
      title: "Do Androids Dream of Electric Sheep?",
      authors: "Philip K. Dick",
      description: "A haunting science fiction novel exploring humanity, empathy, and artificial life.",
      genre: "Science Fiction",
      release_date: "1968",
      isbn: "9780345404473",
      image: "https://covers.openlibrary.org/b/isbn/9780345404473-L.jpg",
      reason: "Recommended because you enjoy thought-provoking speculative fiction",
    },
  ];

  const mockBooks = [
    {
      title: "Dune",
      authors: "Frank Herbert",
      description: "A sweeping science fiction epic about power, prophecy, and survival on Arrakis.",
      genre: "Science Fiction",
      release_date: "1965",
      isbn: "9780441172719",
      image: "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg",
      reason: "Recommended because you enjoy immersive worlds and political intrigue",
    },
    {
      title: "Harry Potter and the Sorcerer's Stone",
      authors: "J.K. Rowling",
      description: "A young wizard discovers a hidden world of magic, friendship, and danger.",
      genre: "Fantasy",
      release_date: "1997",
      isbn: "9780590353427",
      image: "https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg",
      reason: "Recommended because you enjoy magical worlds and unforgettable characters",
    },
    {
      title: "Mistborn",
      authors: "Brandon Sanderson",
      description: "A dark world where ash falls from the sky and a rebellion begins.",
      genre: "Fantasy",
      release_date: "2006",
      isbn: "9780765311788",
      image: "https://covers.openlibrary.org/b/isbn/9780765311788-L.jpg",
      reason: "Recommended because you liked Dune",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: pageBackground, color: textPrimary }}
    >

      {/* HERO */}

      <section
        style={{
          background: `linear-gradient(180deg, ${accentSoft} 0%, ${pageBackground} 100%)`,
          borderBottom: `1px solid ${dividerColor}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-10 items-center">

          <div>
            <h1
              className="text-5xl font-semibold leading-tight mb-6"
              style={{ color: textPrimary }}
            >
              Discover Books That Actually Match Your Taste
            </h1>

            <p className="text-lg mb-8" style={{ color: textMuted }}>
              BookMatch AI analyzes themes, style and genre from books you love
              to generate truly personalized recommendations.
            </p>

            <div className="flex gap-4">
                <Link
                  to="/search"
                  className="px-6 py-3 rounded-lg"
                  style={{
                    backgroundColor: accent,
                    color: "#ffffff",
                    textDecoration: "none",
                    boxShadow: shadow,
                  }}
                >
                  Try BookMatch
                </Link>

                <Link
                  to="/about"
                  className="px-6 py-3 rounded-lg"
                  style={{
                    border: `1px solid ${borderColor}`,
                    color: textSecondary,
                    textDecoration: "none",
                    backgroundColor: cardBackground,
                  }}
                >
                  Learn More
                </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <BookCard
              {...heroBooks[0]}
              buttonTo="/dashboard"
              buttonLabel="Open Dashboard"
            />
            <BookCard
              {...heroBooks[1]}
              buttonTo="/dashboard"
              buttonLabel="Open Dashboard"
            />
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}

      <section id="how" className="py-16">
        <div className="max-w-7xl mx-auto px-8">

          <h2
            className="text-3xl font-semibold text-center mb-8"
            style={{ color: textPrimary }}
          >
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-center">

            <div
              className="p-6 rounded-xl"
              style={{
                background: cardBackground,
                boxShadow: shadow,
                border: `1px solid ${dividerColor}`,
              }}
            >
              <div className="text-3xl mb-4">📚</div>
              <h3 className="font-semibold text-lg mb-2">Enter Books</h3>
              <p style={{ color: textSecondary }}>
                Provide a few books you already enjoy.
              </p>
            </div>

            <div
              className="p-6 rounded-xl"
              style={{
                background: cardBackground,
                boxShadow: shadow,
                border: `1px solid ${dividerColor}`,
              }}
            >
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
              <p style={{ color: textSecondary }}>
                The AI analyzes writing style, themes and genre.
              </p>
            </div>

            <div
              className="p-6 rounded-xl"
              style={{
                background: cardBackground,
                boxShadow: shadow,
                border: `1px solid ${dividerColor}`,
              }}
            >
              <div className="text-3xl mb-4">✨</div>
              <h3 className="font-semibold text-lg mb-2">Get Matches</h3>
              <p style={{ color: textSecondary }}>
                Receive personalized recommendations instantly.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* FEATURES */}

      <section
        id="features"
        className="py-16"
        style={{ borderTop: `1px solid ${dividerColor}` }}
      >

        <div className="max-w-7xl mx-auto px-8">

          <h2
            className="text-3xl font-semibold text-center mb-8"
            style={{ color: textPrimary }}
          >
            Why BookMatch AI
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <div
              className="p-6 rounded-xl"
              style={{
                background: cardBackground,
                boxShadow: shadow,
                border: `1px solid ${dividerColor}`,
              }}
            >
              <h3 className="font-semibold mb-2">AI Taste Matching</h3>
              <p className="text-sm" style={{ color: textSecondary }}>
                Discover books that match tone, theme and narrative style.
              </p>
            </div>

            <div
              className="p-6 rounded-xl"
              style={{
                background: cardBackground,
                boxShadow: shadow,
                border: `1px solid ${dividerColor}`,
              }}
            >
              <h3 className="font-semibold mb-2">Smart Explanations</h3>
              <p className="text-sm" style={{ color: textSecondary }}>
                Understand why each recommendation fits your taste.
              </p>
            </div>

            <div
              className="p-6 rounded-xl"
              style={{
                background: cardBackground,
                boxShadow: shadow,
                border: `1px solid ${dividerColor}`,
              }}
            >
              <h3 className="font-semibold mb-2">Personal Book Lists</h3>
              <p className="text-sm" style={{ color: textSecondary }}>
                Save and organize recommendations in custom lists.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* PREVIEW RECOMMENDATIONS */}

      <section className="max-w-7xl mx-auto px-8 py-20">

        <h2
          className="text-3xl font-semibold text-center mb-10"
          style={{ color: textPrimary }}
        >
          Example Recommendations
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {mockBooks.map((book, i) => (
            <BookCard
              key={i}
              {...book}
              buttonTo="/dashboard"
              buttonLabel="Open Dashboard"
            />
          ))}

        </div>

      </section>


      {/* CTA */}

      <section
        className="py-14 text-center"
        style={{
          backgroundColor: accent,
          color: "#ffffff",
          borderTop: `1px solid ${accentBorder}`,
        }}
      >

        <h2 className="text-3xl font-bold mb-4">
          Ready to discover your next favorite book?
        </h2>

        <Link
          to="/search"
          className="inline-block px-8 py-4 rounded-lg font-semibold"
          style={{
            backgroundColor: "#ffffff",
            color: accent,
            boxShadow: shadow,
            textDecoration: "none",
          }}
        >
          Start Matching
        </Link>

      </section>
    </div>
  );
}

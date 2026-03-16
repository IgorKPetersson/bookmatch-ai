import { Link } from "react-router-dom";
import React from "react";
import BookCard from "../components/BookCard";

export default function Index() {
  const mockBooks = [
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
      title: "Mistborn",
      authors: "Brandon Sanderson",
      description: "A dark world where ash falls from the sky and a rebellion begins.",
      genre: "Fantasy",
      release_date: "2006",
      isbn: "9780765311788",
      image: "https://covers.openlibrary.org/b/isbn/9780765311788-L.jpg",
      reason: "Recommended because you liked Dune",
    },
    {
      title: "The Blade Itself",
      authors: "Joe Abercrombie",
      description: "A gritty character-driven fantasy with political intrigue.",
      genre: "Fantasy",
      release_date: "2006",
      isbn: "9780575079798",
      image: "https://covers.openlibrary.org/b/isbn/9781591025948-L.jpg",
      reason: "Recommended because you liked The Hobbit",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* HERO */}

      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-8 py-28 grid md:grid-cols-2 gap-16 items-center">

          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Discover Books That Actually Match Your Taste
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              BookMatch AI analyzes themes, style and genre from books you love
              to generate truly personalized recommendations.
            </p>

            <div className="flex gap-4">
                <Link
                  to="/search"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                >
                  Try BookMatch
                </Link>

                <Link
                  to="/about"
                  className="border px-6 py-3 rounded-lg"
                >
                  Learn More
                </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <BookCard {...mockBooks[0]} />
            <BookCard {...mockBooks[1]} />
          </div>

        </div>
      </section>


      {/* TRY IT DEMO */}

      <section className="max-w-3xl mx-auto px-8 py-24">

        <div className="bg-white shadow-xl rounded-xl p-8 flex flex-col gap-4">

          <h2 className="text-xl font-semibold mb-2">
            Try the recommendation engine
          </h2>

          <input
            className="border rounded p-3"
            placeholder="Enter a book you like"
          />

          <input
            className="border rounded p-3"
            placeholder="Another book you enjoyed"
          />

          <input
            className="border rounded p-3"
            placeholder="One more favorite"
          />

          <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded mt-2">
            Generate Recommendations
          </button>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section id="how" className="bg-white py-28">
        <div className="max-w-7xl mx-auto px-8">

          <h2 className="text-3xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10 text-center">

            <div className="p-6">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="font-semibold text-lg mb-2">Enter Books</h3>
              <p className="text-gray-600">
                Provide a few books you already enjoy.
              </p>
            </div>

            <div className="p-6">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                The AI analyzes writing style, themes and genre.
              </p>
            </div>

            <div className="p-6">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="font-semibold text-lg mb-2">Get Matches</h3>
              <p className="text-gray-600">
                Receive personalized recommendations instantly.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* FEATURES */}

      <section id="features" className="bg-gray-50 py-28">

        <div className="max-w-7xl mx-auto px-8">

          <h2 className="text-3xl font-bold text-center mb-16">
            Why BookMatch AI
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-2">AI Taste Matching</h3>
              <p className="text-gray-600 text-sm">
                Discover books that match tone, theme and narrative style.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-2">Smart Explanations</h3>
              <p className="text-gray-600 text-sm">
                Understand why each recommendation fits your taste.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-2">Personal Book Lists</h3>
              <p className="text-gray-600 text-sm">
                Save and organize recommendations in custom lists.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* PREVIEW RECOMMENDATIONS */}

      <section className="max-w-7xl mx-auto px-8 py-28">

        <h2 className="text-3xl font-bold text-center mb-16">
          Example Recommendations
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {mockBooks.map((book, i) => (
            <BookCard key={i} {...book} />
          ))}

        </div>

      </section>


      {/* CTA */}

      <section className="bg-blue-600 py-20 text-center text-white">

        <h2 className="text-3xl font-bold mb-6">
          Ready to discover your next favorite book?
        </h2>

        <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold">
          Start Matching
        </button>

      </section>
    </div>
  );
}

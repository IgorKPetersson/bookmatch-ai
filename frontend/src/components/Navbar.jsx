import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const linkStyle = "text-gray-700 hover:text-blue-600 transition";
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/books", {
      credentials: "include"
    })
      .then(res => {
        if (res.ok) setLoggedIn(true);
      })
      .catch(() => setLoggedIn(false));
  }, []);

  async function handleLogout() {
    await fetch(import.meta.env.VITE_API_URL + "/logout", {
      method: "POST",
      credentials: "include"
    });

    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-8">
        <div className="py-4 flex items-center justify-between">

          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold text-blue-600">
            BookMatch AI
          </NavLink>

          {/* Center Navigation */}
          <div className="hidden md:flex gap-8 text-sm font-medium">

            <NavLink
              to="/"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? "text-blue-600 font-semibold" : ""}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? "text-blue-600 font-semibold" : ""}`
              }
            >
              Search
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? "text-blue-600 font-semibold" : ""}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? "text-blue-600 font-semibold" : ""}`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? "text-blue-600 font-semibold" : ""}`
              }
            >
              Contact
            </NavLink>

          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-blue-600"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/auth"
                className="text-sm text-gray-700 hover:text-blue-600"
              >
                Login
              </NavLink>
            )}

            {!loggedIn && (
            <NavLink
              to="/register"
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </NavLink>
          )}

          </div>

        </div>
      </div>
    </nav>
  );
}
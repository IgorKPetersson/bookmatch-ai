import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const linkStyle = "text-gray-700 hover:text-blue-600 transition";
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/search", label: "Search" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" }
  ];

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
        <div className="py-4 flex items-center justify-between relative">

          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold text-blue-600">
            BookMatch AI
          </NavLink>

          {/* Center Navigation - desktop */}
          <div className="hidden md:flex gap-8 text-sm font-medium">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${linkStyle} ${isActive ? "text-blue-600 font-semibold" : ""}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
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

            {/* Mobile menu toggle */}
            <button
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-700"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(open => !open)}
            >
              <span className="sr-only">Menu</span>
              <div className="space-y-1.5">
                <span className={`block h-0.5 w-5 bg-current transition ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
                <span className={`block h-0.5 w-5 bg-current transition ${menuOpen ? "opacity-0" : ""}`}></span>
                <span className={`block h-0.5 w-5 bg-current transition ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile dropdown */}
          {menuOpen && (
            <div className="md:hidden absolute right-4 top-16 w-64 rounded-2xl border border-gray-200 bg-white shadow-xl p-4 flex flex-col gap-3">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block text-sm font-medium ${linkStyle} ${isActive ? "text-blue-600 font-semibold" : ""}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="h-px bg-gray-100 my-2" />

              {loggedIn ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-sm text-left text-gray-700 hover:text-blue-600"
                >
                  Logout
                </button>
              ) : (
                <>
                  <NavLink
                    to="/auth"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-gray-700 hover:text-blue-600"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
                  >
                    Get Started
                  </NavLink>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}

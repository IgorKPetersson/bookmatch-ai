import { useState } from "react";
import { Link } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  }

  async function handleLogin(e) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        setError(data?.message || "Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: "#f7f3ee", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex justify-center pt-20">
          <form
            onSubmit={handleLogin}
            className="p-8 rounded-xl w-96"
            style={{
              background: "white",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}
          >
            <h1
              className="text-2xl font-semibold mb-6 text-center"
              style={{ color: "#1a1a1a" }}
            >
              Login
            </h1>

            {error && (
              <div
                className="p-2 rounded mb-4 text-sm"
                style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}
              >
                {error}
              </div>
            )}

            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#5f574f" }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2"
              style={{ border: "1px solid #e0dbd3", color: "#1a1a1a" }}
            />

            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#5f574f" }}
            >
              Password
            </label>

            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2"
                style={{ border: "1px solid #e0dbd3", color: "#1a1a1a" }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-sm"
                style={{ color: "#8d7f70" }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="text-right mb-4">
              <Link
                to="/forgot-password"
                className="text-sm hover:underline"
                style={{ color: "#4f6ef7" }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="text-white px-4 py-3 w-full rounded-md font-semibold disabled:opacity-50"
              style={{ backgroundColor: "#4f6ef7" }}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            <p
              className="text-sm text-center mt-6"
              style={{ color: "#5f574f" }}
            >
              Don't have an account?{" "}
              <Link to="/register" className="hover:underline" style={{ color: "#4f6ef7" }}>
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  function validate() {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords need to match";

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    try {
      const res = await fetch("http://localhost:8000/auth/reset_password", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, new_password: password }),
      });

      const data = await res.json();
      if (res.ok) {
        window.location.href = "/auth";
      } else {
        setError(data.detail);
      }
    } catch (err) {
      setError("Server error. Try again later.");
    }
  }

  return (
    <div style={{ backgroundColor: "#f7f3ee", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex justify-center pt-20">
          <form
            onSubmit={handleSubmit}
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
              Reset Password
            </h1>

            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#5f574f" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2"
              style={{ border: "1px solid #e0dbd3", color: "#1a1a1a" }}
            />
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#5f574f" }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-3 py-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2"
              style={{ border: "1px solid #e0dbd3", color: "#1a1a1a" }}
            />
            <button
              type="submit"
              className="text-white px-4 py-3 w-full rounded-md font-semibold disabled:opacity-50"
              style={{ backgroundColor: "rgb(79, 110, 247)" }}
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

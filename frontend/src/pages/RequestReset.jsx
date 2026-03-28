import { useState } from "react";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function validate() {
    if (!email) return "Email is required";
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
      const res = await fetch(import.meta.env.VITE_API_URL + "/auth/reset_link", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await res.json();

      setMessage(data.message);
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
            <p
              className="text-sm leading-6 mb-4 text-center"
              style={{ color: "#5f574f" }}
            >
              Enter the email you used to create your account. We’ll send a reset
              link that stays active for 15 minutes. Check your spam folder if
              you don’t see it right away.
            </p>

            {error && (
              <div
                className="p-2 rounded mb-4 text-sm"
                style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}
              >
                {error}
              </div>
            )}
            {message && (
              <div
                className="p-2 rounded mb-4 text-sm"
                style={{ backgroundColor: "#f0fdf4", color: "#15803d" }}
              >
                {message}
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
            <button
              type="submit"
              className="text-white px-4 py-3 w-full rounded-md font-semibold disabled:opacity-50"
              style={{ backgroundColor: "rgb(79, 110, 247)" }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

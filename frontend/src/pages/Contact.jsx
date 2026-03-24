import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setStatus("Please fill in all fields.");
      return;
    }

    setStatus("Thank you! Your message has been sent.");

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div style={{ backgroundColor: "#f7f3ee", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div
          className="w-full max-w-3xl mx-auto p-10"
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          }}
        >

          <div className="text-center mb-8">
            <h1
              className="text-3xl font-semibold"
              style={{ color: "#1a1a1a" }}
            >
              Contact Us
            </h1>
            <p className="mt-2" style={{ color: "#8d7f70" }}>
              Have questions or feedback about BookMatch?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#5f574f" }}
              >
                Name
              </label>
              <input
                className="px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2"
                style={{
                  border: "1px solid #e0dbd3",
                  color: "#1a1a1a",
                }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#5f574f" }}
              >
                Email
              </label>
              <input
                className="px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2"
                style={{
                  border: "1px solid #e0dbd3",
                  color: "#1a1a1a",
                }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#5f574f" }}
              >
                Message
              </label>
              <textarea
                className="px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2"
                style={{
                  border: "1px solid #e0dbd3",
                  color: "#1a1a1a",
                }}
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              className="text-white px-4 py-3 w-full rounded-md font-semibold"
              style={{ backgroundColor: "#4f6ef7" }}
            >
              Send Message
            </button>

            {status && (
              <p className="text-sm mt-3" style={{ color: "#5f574f" }}>
                {status}
              </p>
            )}

          </form>

          <div
            className="my-8"
            style={{ borderTop: "1px solid #f0ece6" }}
          ></div>

          <div className="text-center">
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: "#1a1a1a" }}
            >
              Project Team
            </h2>
            <p style={{ color: "#5f574f" }}>Igor Petersson</p>
            <p style={{ color: "#5f574f" }}>Oliver Cupan</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;

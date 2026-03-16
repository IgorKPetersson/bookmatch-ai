import PageContainer from "../components/PageContainer";
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
    <PageContainer>
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-3xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold">Contact Us</h1>
          <p className="text-gray-600 mt-2">
            Have questions or feedback about BookMatch?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              className="border border-gray-300 px-3 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 w-full rounded-md font-semibold"
          >
            Send Message
          </button>

          {status && <p className="text-sm text-gray-700 mt-3">{status}</p>}

        </form>

        <div className="border-t border-gray-200 my-8"></div>

        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Project Team</h2>
          <p>Igor Petersson</p>
          <p>Oliver Cupan</p>
        </div>

      </div>
    </PageContainer>
  );
}

export default Contact;

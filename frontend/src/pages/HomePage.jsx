import { useState, useEffect } from "react";

export default function HomePage() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((response) => response.json())
      .then((data) => setStatus(data.status))
      .catch((error) => {
        (setError(error), console.error("Failed: ", error));
      });
  }, []);
  return (
    <div>
      <h1>BookMatch</h1>
      <p>Backend status: {status ?? "loading..."}</p>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function handleSubmit() {
    fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Registration failed.");
        }
        return response.json();
      })
      .then(() => navigate("/login"))
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="oliver.cupan@hotmail.com"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="'oliver123123'"
      />
      <button onClick={handleSubmit}>SUBMIT</button>
    </div>
  );
}

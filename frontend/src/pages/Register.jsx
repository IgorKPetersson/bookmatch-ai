import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/register", {
        email,
        password,
      });

      console.log(response.data);

      setMessage("User created! Redirecting to login..");
      setTimeout(() => {
      navigate("/auth");
      }, 1500);

    } catch (error) {
      console.error(error);
      setMessage("Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl mb-4">Register</h2>

        <input
          className="border p-2 w-full mb-4"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 w-full"
          type="submit"
        >
          Register
        </button>

        {message && <p className="mt-4">{message}</p>}
      </form>
    </div>
  );
}

export default Register;
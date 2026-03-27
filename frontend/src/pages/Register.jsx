import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GoogleAuthButton from "../components/GoogleAuthButton";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/register", {
        email,
        password,
        full_name: `${firstName} ${lastName}`.trim(),
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
    <div style={{ backgroundColor: "#f7f3ee", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex justify-center pt-20">
          <form
            onSubmit={handleRegister}
            className="p-8 rounded w-96"
            style={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}
          >
            <div className="text-center mb-6 space-y-1">
              <h2 className="text-2xl font-semibold" style={{ color: "#1a1a1a" }}>
                Create account
              </h2>

              <p className="text-sm" style={{ color: "#8d7f70" }}>
                Get personalized book recommendations
              </p>

              <p className="text-sm" style={{ color: "#5f574f" }}>
                Already have an account?{" "}
                <a href="/auth" className="hover:underline" style={{ color: "#4f6ef7" }}>
                  Log in
                </a>
              </p>
            </div>
            <div className="my-6" style={{ borderTop: "1px solid #f0ece6" }}></div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2" style={{ color: "#5f574f" }}>
                  First name
                </label>
                <input
                  className="px-3 py-2 w-full mb-5 rounded-md focus:outline-none focus:ring-2"
                  style={{ border: "1px solid #e0dbd3", color: "#1a1a1a" }}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2" style={{ color: "#5f574f" }}>
                  Last name
                </label>
                <input
                  className="px-3 py-2 w-full mb-5 rounded-md focus:outline-none focus:ring-2"
                  style={{ border: "1px solid #e0dbd3", color: "#1a1a1a" }}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <label className="block text-sm font-medium mb-1" style={{ color: "#5f574f" }}>
              Email address
            </label>
            <input
              className="px-3 py-2 w-full mb-5 rounded-md focus:outline-none focus:ring-2"
              style={{ border: "1px solid #e0dbd3", color: "#1a1a1a" }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="block text-sm font-medium mb-2" style={{ color: "#5f574f" }}>
              Password
            </label>
            <div className="relative">
              <input
                className="px-3 py-2 w-full mb-5 rounded-md focus:outline-none focus:ring-2"
                style={{ border: "1px solid #e0dbd3", color: "#1a1a1a" }}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <label className="block text-sm font-medium mb-2" style={{ color: "#5f574f" }}>
              Confirm password
            </label>

            <div className="relative">
              <input
                className="px-3 py-2 w-full mb-5 rounded-md focus:outline-none focus:ring-2"
                style={{ border: "1px solid #e0dbd3", color: "#1a1a1a" }}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2 text-sm"
                style={{ color: "#8d7f70" }}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              className="text-white px-4 py-3 w-full rounded-md font-semibold"
              style={{ backgroundColor: "#4f6ef7" }}
              type="submit"
            >
              Register
            </button>

            <div className="my-4" style={{ borderTop: "1px solid #f0ece6" }}></div>

            <GoogleAuthButton label="Continue with Google" />

            {message && <p className="mt-4" style={{ color: "#5f574f" }}>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

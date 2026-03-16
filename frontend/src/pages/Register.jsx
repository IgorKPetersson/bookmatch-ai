import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";

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
    <PageContainer>
    <div className="flex justify-center pt-20">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <div className="text-center mb-6 space-y-1">
          <h2 className="text-2xl font-semibold">Create account</h2>

          <p className="text-sm text-gray-600">
            Get personalized book recommendations
          </p>

          <p className="text-sm">
            Already have an account?{" "}
            <a href="/auth" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
        </div>
        <div className="border-t border-gray-200 my-6"></div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First name
            </label>
            <input
              className="border border-gray-300 px-3 py-2 w-full mb-5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last name
            </label>
            <input
              className="border border-gray-300 px-3 py-2 w-full mb-5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          className="border border-gray-300 px-3 py-2 w-full mb-5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password field with eye toggle */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            className="border border-gray-300 px-3 py-2 w-full mb-5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
         <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1 text-gray-600"
        >
          {showPassword ? (
            // Eye closed SVG
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.66.405-3.218 1.112-4.575m3.086-2.525A9.955 9.955 0 0112 5c5.523 0 10 4.477 10 10 0 1.66-.405 3.218-1.112 4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            // Eye open SVG
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
        </div>

        {/* Confirm password field */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm password
        </label>

        <div className="relative">
          <input
            className="border border-gray-300 px-3 py-2 w-full mb-5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1 text-gray-600"
          >
            {showConfirmPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.66.405-3.218 1.112-4.575m3.086-2.525A9.955 9.955 0 0112 5c5.523 0 10 4.477 10 10 0 1.66-.405 3.218-1.112 4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Register button */}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 w-full rounded-md font-semibold"
          type="submit"
        >
          Register
        </button>

        {message && <p className="mt-4">{message}</p>}
      </form>
    </div>
    </PageContainer>
  );
}

export default Register;
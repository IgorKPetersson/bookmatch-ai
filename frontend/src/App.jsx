import Register from "./pages/Register";
import { Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import About from "./pages/About";

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Index</Link> | <Link to="/search">Search</Link> |{" "}
        <Link to="/register">Register</Link> | <Link to="/auth">Login</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/contact">Contact</Link> | <Link to="/about">About</Link>{" "}
        |{" "}
      </nav>

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<Search />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

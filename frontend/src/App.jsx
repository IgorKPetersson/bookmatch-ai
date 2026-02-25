import { Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import BookList from "./pages/BookList"
import BookDetail from "./pages/BookDetail"

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="p-4 border-b border-zinc-800 flex gap-6">
        <Link to="/" className="hover:text-emerald-400">Home</Link>
        <Link to="/books" className="hover:text-emerald-400">Books</Link>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </div>
    </div>
  )
}
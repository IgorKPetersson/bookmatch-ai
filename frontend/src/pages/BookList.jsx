const mockBooks = [
  { id: 1, title: "Atomic Habits", author: "James Clear" },
  { id: 2, title: "Deep Work", author: "Cal Newport" },
  { id: 3, title: "The Pragmatic Programmer", author: "Andrew Hunt" },
]

export default function BookList() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Book List</h1>

      <div className="grid gap-4">
        {mockBooks.map((book) => (
          <div
            key={book.id}
            className="p-4 border border-zinc-800 rounded-lg bg-zinc-900"
          >
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-zinc-400">{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
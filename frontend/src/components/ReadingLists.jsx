import BookItem from "./BookItem";

function Chevron({ open }) {
  return (
    <span
      className={`text-sm text-gray-400 transition-transform ${
        open ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      ▼
    </span>
  );
}

export default function ReadingLists({
  lists,
  onToggle,
  onMoveBook,
  onRemoveBook,
  onCreateList,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Your Reading Lists</h2>

      {lists.map((list) => (
        <div key={list.id} className="mb-3 rounded-xl border border-gray-100 last:mb-0">
          <button
            type="button"
            onClick={() => onToggle(list.id)}
            className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
          >
            <span className="text-sm font-medium text-gray-700">
              {list.name} ({list.books.length})
            </span>
            <Chevron open={list.open} />
          </button>

          {list.open &&
            list.books.map((book) => (
              <BookItem
                key={book.id}
                book={book}
                onMove={() => onMoveBook(list.id, book.id)}
                onRemove={() => onRemoveBook(list.id, book.id)}
              />
            ))}
        </div>
      ))}

      <button
        type="button"
        onClick={onCreateList}
        className="mt-4 w-full rounded-xl border border-dashed border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50"
      >
        Create New List
      </button>
    </div>
  );
}

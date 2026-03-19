export default function BookItem({ book, onMove, onRemove }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={book.coverUrl}
          alt={`${book.title} cover`}
          className="h-14 w-10 rounded object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-800">{book.title}</p>
          <p className="truncate text-xs text-gray-500">{book.author}</p>
        </div>
      </div>

      <div className="ml-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onMove}
          className="rounded-lg bg-gray-100 px-3 py-1 text-xs hover:bg-gray-200"
        >
          Move
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg bg-red-50 px-3 py-1 text-xs text-red-600 hover:bg-red-100"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

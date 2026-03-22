export default function BookCard({ title, authors, listName }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer">
      {/* Image */}
      <div className="aspect-[2/3] bg-gray-100 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h2 className="font-semibold text-base leading-snug line-clamp-2 min-h-[2.5rem]">
          {title}
        </h2>

        {/* Author */}
        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{authors}</p>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-3 line-clamp-3 min-h-[4.5rem]">
          {description}
        </p>

        {/* Metadata */}
        <div className="text-xs text-gray-500 mt-4 space-y-1">
          <p>Genre: {genre}</p>
          <p>Release: {release_date}</p>
        </div>

        {/* AI reason */}
        <div className="mt-4 text-xs text-blue-600 bg-blue-50 p-2 rounded line-clamp-2">
          {reason}
        </div>

        {/* Button */}
        <button className="mt-auto bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded mt-4">
          Save this book
        </button>
      </div>
    </div>
  );
}

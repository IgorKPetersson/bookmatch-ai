import React from "react";

export default function BookCard({
  title,
  authors,
  description,
  isbn,
  genre,
  release_date,
  image,
  reason,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col h-full">

      {/* Image */}
      <div className="aspect-[2/3] bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">

        {/* Title */}
        <h2 className="font-semibold text-base leading-snug line-clamp-2">
          {title}
        </h2>

        {/* Author */}
        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
          {authors}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-3 line-clamp-3">
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

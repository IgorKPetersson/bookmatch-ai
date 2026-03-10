import React from "react";

export default function BookCard({ title, author, reason, genre, coverUrl }) {
  return (
    <div>
      <div>Title: {title}</div>
      <div>Author: {author}</div>
      <div>Reason: {reason}</div>
    </div>
  );
}

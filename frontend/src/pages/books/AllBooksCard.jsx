import React from "react";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";

const AllBooksCard = ({ book }) => {
  return (
    <Link
      to={`/books/${book._id}`}
      className="flex flex-col items-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image container with fixed height */}
      <div className="w-full h-64 flex justify-center items-center p-2">
        <img
          src={getImgUrl(book.coverImage)}
          alt={book.title}
          className="max-h-full object-contain"
        />
      </div>

      {/* Title & Author */}
      <div className="w-full p-2 text-center">
        <h3 className="text-sm font-semibold truncate">{book.title}</h3>
        <p className="text-xs text-gray-600 truncate">{book.author}</p>
      </div>
    </Link>
  );
};

export default AllBooksCard;

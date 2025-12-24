import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getImgUrl } from "../../utils/getImgUrl";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useFetchBookByIdQuery } from "../../redux/features/books/booksApi";

const SingleBook = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  if (isLoading)
    return <div className="text-center py-10 text-gray-200">Loading...</div>;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Error loading book info
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a1a2b] p-6 md:p-10 flex justify-center items-start">
      <div className="max-w-6xl w-full bg-[#0a1a2b] rounded-2xl shadow-2xl flex flex-col md:flex-row gap-10 p-6 md:p-10 text-gray-100">
        {/* Book Image */}
        <div className="md:w-1/3 flex justify-center items-start">
          <img
            src={getImgUrl(book.coverImage)}
            alt={book.title}
            className="w-full max-w-xs md:max-w-full object-contain rounded-xl shadow-lg"
          />
        </div>

        {/* Book Details */}
        <div className="md:w-2/3 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4">
              {book.title}
            </h1>
            <p className="text-lg text-gray-300 mb-2">
              <strong className="text-amber-300">Author:</strong>{" "}
              {book.author || "Unknown"}
            </p>
            <p className="text-gray-400 mb-2">
              <strong className="text-amber-300">Published:</strong>{" "}
              {new Date(book?.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-400 mb-2 capitalize">
              <strong className="text-amber-300">Category:</strong>{" "}
              {book?.category}
            </p>
            <p className="text-gray-300 mt-4">
              <strong className="text-amber-300">Description:</strong>{" "}
              {book.description}
            </p>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-6">
            <button
              onClick={() => handleAddToCart(book)}
              className="w-full md:w-auto bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 
                         hover:from-amber-500 hover:to-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-xl 
                         shadow-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
            >
              <FiShoppingCart className="text-xl" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;

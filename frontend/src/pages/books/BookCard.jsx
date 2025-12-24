import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { getImgUrl } from "../../utils/getImgUrl";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const [selectedSellerIndex, setSelectedSellerIndex] = useState(0);

  const sellers = book?.uploadedBy || [];
  const selectedSeller = sellers[selectedSellerIndex] || {};

  const sellerPrice = selectedSeller?.price || 0;
  const sellerStock = selectedSeller?.stock || 0;

  const handleAddToCart = () => {
    if (!selectedSeller?.seller) {
      alert("This book is not available for sale currently.");
      return;
    }

    dispatch(
      addToCart({
        ...book,
        seller: selectedSeller.seller,
        sellerName: selectedSeller.seller?.username, // 🚀 Added seller name for cart
        price: selectedSeller.price,
        stock: selectedSeller.stock,
      })
    );
  };

  return (
    <div className="rounded-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:h-72 sm:justify-center gap-4">
        {/* Book Image */}
        <div className="sm:h-72 sm:flex-shrink-0 border rounded-md">
          <Link to={`/books/${book._id}`}>
            <img
              src={getImgUrl(book?.coverImage)}
              alt={book?.title}
              className="w-full bg-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
            />
          </Link>
        </div>

        {/* Book Details */}
        <div>
          <Link to={`/books/${book._id}`}>
            <h3 className="text-xl font-semibold hover:text-blue-600 mb-3">
              {book?.title}
            </h3>
          </Link>

          <p className="text-gray-600 mb-2">
            {book?.description.length > 80
              ? `${book.description.slice(0, 80)}...`
              : book?.description}
          </p>

          {/* 🚀 Seller Dropdown with accessibility */}
          {sellers.length > 0 ? (
            <div className="mb-3">
              <label
                htmlFor={`seller-${book._id}`} // 🚀 Added htmlFor
                className="text-sm font-medium mr-2"
              >
                Sellers:
              </label>
              <select
                id={`seller-${book._id}`} // 🚀 Added id matching label
                value={selectedSellerIndex}
                onChange={(e) => setSelectedSellerIndex(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {sellers.map((s, index) => (
                  <option
                    key={`${book._id}-${s.seller?._id || index}`} // unique key fix + fallback
                    value={index}
                  >
                    {s.seller?.username || "Unknown Seller"} - ₹{s.price} (
                    {s.stock} in stock)
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-3">Out of stock</p>
          )}

          <p className="font-medium mb-5">
            ₹{sellerPrice}{" "}
            {book?.oldPrice && (
              <span className="line-through font-normal ml-2">
                ₹ {book?.oldPrice}
              </span>
            )}
          </p>

          <button
            onClick={handleAddToCart}
            className={`btn-primary px-6 space-x-1 flex items-center gap-1 ${
              sellerStock <= 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={sellerStock <= 0}
          >
            <FiShoppingCart />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

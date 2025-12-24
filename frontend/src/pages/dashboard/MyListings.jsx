import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiBook } from "react-icons/fi";

const MyListings = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/books/my-books",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching seller books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-black font-semibold">
        Loading your listings...
      </div>
    );

  if (!books.length)
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-black">
          You haven’t uploaded any books yet.
        </h2>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">My Listings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => {
          const sellerEntry = book.uploadedBy[0];
          const shortDesc =
            book.description.length > 100
              ? book.description.slice(0, 97) + "..."
              : book.description;

          return (
            <div
              key={book._id}
              className="bg-blue-50 rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col"
            >
              <div className="flex justify-center items-center bg-blue-100 w-full h-48">
                <FiBook className="text-6xl text-blue-700" />
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-lg font-semibold text-black mb-1">
                    {book.title}
                  </h2>
                  <p className="text-sm italic text-gray-600 mb-2">
                    by {book.author}
                  </p>
                  <p className="text-sm text-gray-700 mb-3">{shortDesc}</p>
                </div>

                <div className="flex justify-between items-center text-sm font-medium text-black mt-2">
                  <span>Stock: {sellerEntry.stock}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyListings;

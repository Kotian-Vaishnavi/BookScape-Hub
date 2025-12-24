import React, { useEffect, useState } from "react";
import axios from "axios";
import getBaseUrl from "../../utils/baseURL";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { BookOpen, TrendingUp, ArrowLeft, Sparkles } from "lucide-react";

const TrendingBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const res = await axios.get(`${getBaseUrl()}/api/books/my-books`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const myBooks = res.data || [];
        const trendingBooks = myBooks.filter((book) => book.trending === true);

        setBooks(trendingBooks);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trending books:", err);
        setLoading(false);
      }
    };

    fetchTrendingBooks();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Soft blue glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-blue-500 animate-bounce" />
            <h1 className="text-5xl font-bold text-blue-600">Trending Books</h1>
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-gray-500 text-lg">
            Discover the most popular reads of the moment
          </p>
        </div>

        {/* Books Table */}
        {books.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-xl">No trending books available</p>
          </div>
        ) : (
          <div className="mb-12 overflow-hidden rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-xl shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-100/50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-bold text-blue-500 uppercase tracking-wider">
                          Status
                        </span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-sm font-bold text-blue-500 uppercase tracking-wider">
                        Title
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-sm font-bold text-blue-500 uppercase tracking-wider">
                        Author
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-sm font-bold text-blue-500 uppercase tracking-wider">
                        Description
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-sm font-bold text-blue-500 uppercase tracking-wider">
                        Category
                      </span>
                    </th>
                    <th className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-blue-500 uppercase tracking-wider">
                        Price
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr
                      key={book._id}
                      className="group hover:bg-blue-50 transition-all duration-300"
                    >
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                          <TrendingUp className="w-3 h-3" />
                          <span>Hot</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-16 bg-gray-100 rounded-lg flex items-center justify-center shadow group-hover:shadow-blue-200 transition-shadow duration-300">
                            <BookOpen className="w-6 h-6 text-blue-400 group-hover:text-blue-600 transition-colors duration-300" />
                          </div>
                          <span className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                            {book.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                          <span className="text-sm text-gray-600">
                            {book.author}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-gray-600 max-w-md line-clamp-2 leading-relaxed">
                          {book.description ?? "No description available"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-block text-xs font-medium text-blue-500 bg-blue-100/30 px-3 py-1.5 rounded-full border border-blue-200">
                          {book.category ?? "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-lg font-bold text-blue-600">
                          ₹{book.newPrice ?? book.price ?? "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow hover:bg-blue-600 hover:shadow-blue-300 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingBooks;

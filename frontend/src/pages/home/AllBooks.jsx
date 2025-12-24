import React, { useState } from "react";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import AllBooksCard from "../books/AllBooksCard";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";

const categories = [
  "Choose a genre",
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Programming",
  "Science Fiction",
  "Romance",
  "Psychology",
  "Fantasy",
  "Horror",
  "Bibliography",
  "Autobiography",
  "History",
  "Self-help",
  "Memoir",
  "Business",
  "Children Books",
  "Travel",
  "Religion",
  "Art and Design",
];

const AllBooks = () => {
  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");
  const { data: books = [] } = useFetchAllBooksQuery();

  // Normalization helper to remove spaces, dashes, punctuation, etc.
  const normalize = (str) =>
    str
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();

  const filteredBooks =
    selectedCategory === "Choose a genre"
      ? books
      : books.filter(
          (book) => normalize(book.category) === normalize(selectedCategory)
        );

  return (
    <div className="py-10 px-6 md:px-16 bg-gradient-to-b from-yellow-200 via-yellow-100 to-yellow-50 min-h-screen">
      {/* Carousel: Non-clickable */}
      {books.length > 0 && (
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold mb-5 text-center text-gray-800 tracking-wide">
            Also Check Out
          </h2>

          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={4}
            spaceBetween={15}
            coverflowEffect={{
              rotate: 25,
              stretch: 0,
              depth: 60,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 1800,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Autoplay, Pagination]}
            className="mySwiper max-w-5xl mx-auto"
          >
            {books.slice(4, 15).map((book) => (
              <SwiperSlide
                key={book._id}
                className="bg-white w-32 sm:w-36 h-[200px] rounded-xl shadow-md flex flex-col items-center justify-between p-2"
              >
                {/* Non-clickable */}
                <div className="flex flex-col items-center text-center w-full h-full">
                  <img
                    src={getImgUrl(book.coverImage)}
                    alt={book.title}
                    className="w-full h-32 object-contain rounded-md"
                  />
                  <h3 className="text-xs font-semibold mt-1 text-gray-800 truncate w-full">
                    {book.title}
                  </h3>
                  <p className="text-[9px] text-gray-600 truncate w-full">
                    {book.author}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <h2 className="text-3xl font-bold mb-6 text-gray-800">All Books</h2>

      {/* Category Filter */}
      <div className="mb-8">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border bg-white border-gray-300 rounded-md px-4 py-2 focus:outline-none"
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Books Grid: Clickable */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 auto-rows-fr">
        {filteredBooks.map((book) => (
          <Link
            to={`/books/${book._id}`}
            key={book._id}
            className="relative group bg-white rounded-xl shadow-md overflow-hidden"
          >
            <AllBooksCard book={book} />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <span className="text-white text-sm font-semibold">
                View Details
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllBooks;

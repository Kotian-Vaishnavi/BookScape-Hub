import React from "react";
import bannerImg from "../../assets/banner.png";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col md:flex-row-reverse py-20 px-6 md:px-16 justify-between items-center gap-12 bg-gradient-to-b from-yellow-200 via-yellow-100 to-yellow-50 overflow-hidden">
      {/* Image Section */}
      <div className="md:w-1/2 w-full flex items-center md:justify-end z-10">
        <img
          src={bannerImg}
          alt="New Releases Banner"
          className="w-full h-auto object-cover rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Text Section */}
      <div className="md:w-1/2 w-full flex flex-col justify-center relative z-10">
        <h1 className="font-serif md:text-6xl text-3xl font-bold mb-6">
          New Releases This Week
          <span className="block w-24 h-1 bg-yellow-400 mt-2 rounded"></span>
        </h1>
        <p className="mb-10 text-gray-700 text-lg md:text-xl leading-relaxed">
          It's time to update your reading list with some of the latest and
          greatest releases in the literary world. From heart-pumping thrillers
          to captivating memoirs, this week's new releases offer something for
          everyone.
        </p>

        {/* Buttons inline at same level */}
        <div>
          {/* Subscribe button scrolls to newsletter section */}
          <a href="#newsletter" className="inline-block mr-8">
            <button className="btn-primary px-6 py-3 w-max text-lg font-semibold rounded-lg shadow-lg transition-transform hover:scale-105 duration-300">
              Subscribe
            </button>
          </a>

          {/* View All Books Button */}
          <button
            onClick={() => navigate("/all-books")}
            className="btn-primary inline-block px-6 py-3 w-max text-lg font-semibold rounded-lg shadow-lg transition-transform hover:scale-105 duration-300"
          >
            All Books
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;

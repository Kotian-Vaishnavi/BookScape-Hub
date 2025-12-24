import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AboutUs = () => {
  const location = useLocation();

  // Scroll to section when navigating with hash
  useEffect(() => {
    if (location.hash === "#contact") {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (location.hash === "#services") {
      const el = document.getElementById("services");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      
      {/* Hero / About Section */}
      <section className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <h1 className="mb-6 text-5xl font-bold text-gray-900">Welcome to BookScape</h1>
        <p className="text-lg text-gray-600 max-w-3xl mb-8">
          BookScape is your ultimate online bookstore where you can buy and sell books, 
          discover new titles, and join a vibrant community of book lovers. 
          Your journey into the world of books begins here.
        </p>
        <a
          href="#contact"
          className="bg-yellow-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition-all"
        >
          Contact Us
        </a>
      </section>

      {/* Services / Features Section */}
      <section
        id="services"
        className="py-20 px-6 flex flex-col md:flex-row justify-center items-center gap-8 bg-gray-100"
      >
        <div className="bg-white rounded-xl shadow-xl p-8 flex-1 text-center hover:scale-105 transition-transform">
          <h3 className="text-2xl font-bold mb-4">Buy Books</h3>
          <p>Find thousands of books across all genres, from fiction to academic resources.</p>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8 flex-1 text-center hover:scale-105 transition-transform">
          <h3 className="text-2xl font-bold mb-4">Sell Books</h3>
          <p>Sell your pre-loved books easily and reach thousands of readers online.</p>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8 flex-1 text-center hover:scale-105 transition-transform">
          <h3 className="text-2xl font-bold mb-4">Community</h3>
          <p>Join a community of book lovers, share reviews, and discover new favorites.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="py-20 bg-gray-50 flex flex-col items-center justify-center"
        id="contact"
      >
        <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
        <form className="flex flex-col max-w-md gap-4 w-full">
          <input
            type="text"
            placeholder="Your Name"
            className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <textarea
            placeholder="Your Message"
            className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-yellow-400"
            rows={4}
          />
          <button className="bg-yellow-500 text-white font-semibold px-6 py-2 rounded shadow-lg hover:bg-yellow-600 transition-all">
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
};

export default AboutUs;

import footerLogo from "../assets/footer-logo.png";
import React, { useState } from "react";
import axios from "axios";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter an email address");
      return;
    }

    try {
      // Use Getform URL or your backend endpoint here
      await axios.post("https://getform.io/f/bejenlqa", { email });
      setMessage("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      console.error(error);
      setMessage("Subscription failed. Please try again.");
    }
  };
  return (
    <footer className="bg-gray-900 text-white py-10 px-4">
      {/* Top Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Side - Logo and Nav */}
        <div className="md:w-1/2 w-full">
          <img src={footerLogo} alt="Logo" className="mb-5 w-36" />
          <ul className="flex flex-col md:flex-row gap-4">
            <li>
              <button
                onClick={() => {
                  if (location.pathname === "/") {
                    // Already on home page → scroll to top
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    // Not on home page → navigate to home
                    navigate("/");
                  }
                }}
                className="hover:text-primary cursor-pointer"
              >
                Home
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  if (location.pathname !== "/about") {
                    // Navigate to AboutUs if not there
                    navigate("/about");
                    setTimeout(() => {
                      const el = document.getElementById("services");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }, 300); // wait a bit for AboutUs to render
                  } else {
                    // Already on AboutUs → scroll to Services
                    const el = document.getElementById("services");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="hover:text-primary cursor-pointer"
              >
                Services
              </button>
            </li>

            <li>
              <Link to="/about" className="hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/about#contact" className="hover:text-primary">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Side - Newsletter */}
        <div id="newsletter" className="md:w-1/2 w-full">
          <p className="mb-4">
            Subscribe to our newsletter to receive the latest updates, news, and
            offers!
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-l-md text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="bg-primary px-6 py-2 rounded-r-md hover:bg-primary-dark"
              onClick={handleSubscribe}
            >
              Subscribe
            </button>
          </div>
          {message && <p className="text-sm mt-2 text-green-400">{message}</p>}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-10 border-t border-gray-700 pt-6">
        {/* Left Side - Privacy Links */}
        <ul className="flex gap-6 mb-4 md:mb-0">
          <li>
            <a href="#privacy" className="hover:text-primary">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#terms" className="hover:text-primary">
              Terms of Service
            </a>
          </li>
        </ul>

        {/* Right Side - Social Icons */}
        <div className="flex gap-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

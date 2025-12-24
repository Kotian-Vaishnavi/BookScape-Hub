import React from "react";
import { Link } from "react-router-dom";

const BecomeSeller = () => {
  return (
    <div className="py-16 px-6 md:px-16 bg-gradient-to-b from-yellow-200 via-yellow-100 to-yellow-50">
      <h2 className="text-3xl font-semibold mb-6">Become a Seller</h2>

      <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-12">
        {/* content */}
        <div className="py-4 sm:w-1/2">
          <h3 className="text-lg font-medium hover:text-blue-500 mb-4">
            Sell Your Books & Earn Money
          </h3>

          <div className="w-12 h-[4px] bg-primary mb-5"></div>

          <p className="text-sm text-gray-600 mb-6">
            Have books lying around? Turn them into cash by becoming a seller on
            our platform! It's easy, fast, and rewarding. Reach thousands of
            buyers instantly and manage your sales from your dashboard. Start
            selling today and watch your books find new homes!
          </p>

          {/* Button styled like Add to Cart, reduced width */}
          <Link
            to="/admin"
            className="btn-primary px-6 flex items-center w-fit"
          >
            Become A Seller
          </Link>
        </div>

        {/* optional placeholder for alignment */}
        <div className="flex-shrink-0 sm:w-1/2"></div>
      </div>
    </div>
  );
};

export default BecomeSeller;

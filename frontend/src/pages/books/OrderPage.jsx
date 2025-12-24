import React from "react";
import { useGetOrderByEmailQuery } from "../../redux/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext";

const OrderPage = () => {
  const { currentUser } = useAuth();

  // UPDATE 1: default orders to empty array
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useGetOrderByEmailQuery(currentUser?.email);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error getting orders data</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

      {orders.length === 0 ? (
        <div>No orders found!</div>
      ) : (
        <div>
          {orders.map((order, index) => (
            //UPDATE 2: safe key
            <div key={order._id || index} className="border-b mb-4 pb-4">
              <p className="p-1 bg-secondary text-white w-10 rounded mb-1">
                # {index + 1}
              </p>
              <h2 className="font-bold">Order ID: {order._id || "N/A"}</h2>
              {/* UPDATE 3: null-safe fields */}
              <p className="text-gray-600">Name: {order.name || "N/A"}</p>
              <p className="text-gray-600">Email: {order.email || "N/A"}</p>
              <p className="text-gray-600">Phone: {order.phone || "N/A"}</p>
              <p className="text-gray-600">
                Total Price: ₹{order.totalPrice || 0}
              </p>

              <h3 className="font-semibold mt-2">Address:</h3>
              {/*  UPDATE 4: null-safe address  */}
              <p>
                {order.address?.city || "N/A"}, {order.address?.state || "N/A"},{" "}
                {order.address?.country || "N/A"},{" "}
                {order.address?.zipcode || "N/A"}
              </p>

              <h3 className="font-semibold mt-2">Products:</h3>
              <ul>
                {/*  UPDATE 5: null-safe orderItems mapping */}
                {(order.orderItems || []).map((item, idx) => {
                  const book = item.bookId || {};
                  const seller = item.sellerId || {};

                  // WhatsApp link for Contact Seller
                  const waLink = seller.phone
                    ? `https://wa.me/${seller.phone}?text=${encodeURIComponent(
                        `Hi, I have placed the order for book "${book.title}".`
                      )}`
                    : null;

                  return (
                    <li key={book._id || idx} className="mb-3">
                      Product ID: {book._id || "N/A"} <br />
                      Book Title: {book.title || "N/A"} <br />
                      Seller ID: {seller._id || item.sellerId || "N/A"} <br />
                      Seller Name: {seller.username ||
                        item.sellerName ||
                        "N/A"}{" "}
                      <br />
                      {/*  Contact Seller Button  */}
                      {waLink ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition">
                            Contact Seller
                          </button>
                        </a>
                      ) : (
                        <button
                          className="bg-gray-400 text-white py-1 px-3 rounded cursor-not-allowed"
                          disabled
                        >
                          Contact Not Available
                        </button>
                      )}
                      {/* ---------------------------------------- */}
                      <br />
                      Quantity: {item.quantity || 1} <br />
                      Price: ₹{item.totalAmount || item.price}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;

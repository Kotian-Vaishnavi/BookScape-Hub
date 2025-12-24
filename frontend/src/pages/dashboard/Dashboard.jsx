import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import getBaseUrl from "../../utils/baseURL";
import { MdIncompleteCircle } from "react-icons/md";
import RevenueChart from "./RevenueChart";
import MyListings from "../dashboard/MyListings";
import VisitCounter from "./VisitCounter";

const Dashboard = () => {
  const [ordersLeft, setOrdersLeft] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [myListings, setMyListings] = useState([]);
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("username") || "Seller";
    setAdminName(storedName);
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch seller dashboard summary
        const response = await axios.get(
          `${getBaseUrl()}/api/admin/seller-dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const dashboardData = response.data;

        // 2️⃣ Fetch all orders for the seller
        const ordersRes = await axios.get(
          `${getBaseUrl()}/api/orders/seller-orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const allOrders = ordersRes.data.orders || [];

        // 3️⃣ Fetch seller's uploaded books to count Products
        const listingsRes = await axios.get(
          `${getBaseUrl()}/api/books/my-books`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const myListings = listingsRes.data || [];
        const trendingBooks = myListings.filter(
          (book) => book.trending === true
        );

        // Calculate percentage relative to seller’s total books
        const trendingPercent = myListings.length
          ? `${Math.round((trendingBooks.length / myListings.length) * 100)} %`
          : "0 %";

        // 4️⃣ Calculate total orders (ignore status)
        const total = allOrders.reduce(
          (acc, order) => acc + order.orderItems.length,
          0
        );
        setTotalOrders(total);

        // 5️⃣ Calculate orders left (pending only)
        const leftCount = allOrders.reduce(
          (acc, order) =>
            acc +
            order.orderItems.filter(
              (item) => (item.status || "pending") === "pending"
            ).length,
          0
        );
        setOrdersLeft(leftCount);

        // 6️⃣ Calculate total sales for CONFIRMED orders
        const totalSalesAmount = allOrders.reduce((acc, order) => {
          return (
            acc +
            order.orderItems
              .filter((item) => item.status === "confirmed")
              .reduce(
                (sum, item) =>
                  sum + (Number(item.totalAmount || item.totalPrice) || 0),
                0
              )
          );
        }, 0);

        // 7️⃣ Update data state with all info
        setData({
          ...dashboardData,
          allOrders,
          myListings, // ✅ Products for flashcard
          totalBooks: myListings.length || 0, // optional, matches flashcard count
          totalSales: totalSalesAmount,
          trendingBooks: trendingBooks.length,
          trendingBooksPercent: trendingPercent,
        });

        // 8️⃣ Override ordersLeft if localStorage has a stored value
        const stored = localStorage.getItem("seller_pending_count");
        if (stored !== null) {
          setOrdersLeft(Number(stored || 0));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();

    // 9️⃣ Listen to localStorage changes
    const handleStorage = (e) => {
      if (e.key === "seller_pending_count") {
        setOrdersLeft(Number(e.newValue || 0));
      }
    };

    // 🔟 Listen to custom event updates from order page
    const handleCustom = (e) => {
      setOrdersLeft(e?.detail?.count ?? 0);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("sellerPendingUpdated", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("sellerPendingUpdated", handleCustom);
    };
  }, []);

  const updateOrdersLeft = (orderId, itemId, newStatus) => {
    const updatedOrders = data.allOrders.map((order) =>
      order._id === orderId
        ? {
            ...order,
            orderItems: order.orderItems.map((item) =>
              item._id === itemId ? { ...item, status: newStatus } : item
            ),
          }
        : order
    );

    setData((prev) => ({ ...prev, allOrders: updatedOrders }));

    const leftCount = updatedOrders.reduce((acc, order) => {
      return (
        acc +
        order.orderItems.filter(
          (item) => (item.status || "pending") === "pending"
        ).length
      );
    }, 0);

    setOrdersLeft(leftCount);
    setTotalOrders(updatedOrders.length);
  };

  if (loading) return <Loading />;

  return (
    <>
      {/* Welcome message */}
      <h2 className="text-xl font-semibold mb-4">Welcome, {adminName}!</h2>
      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="flex items-center p-8 bg-white shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <span className="block text-2xl font-bold">
              {data?.myListings?.length || 0}
            </span>
            <span className="block text-gray-500">Products</span>
          </div>
        </div>
        <div className="flex items-center p-8 bg-white shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div>
            <span className="block text-2xl font-bold">
              ₹{data?.totalSales}
            </span>
            <span className="block text-gray-500">Total Sales</span>
          </div>
        </div>
        {/* Trending Books */}
        <div
          className="flex items-center p-8 bg-white shadow rounded-lg cursor-pointer hover:bg-purple-50"
          onClick={() => navigate("/dashboard/trending-books")}
        >
          <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          </div>
          <div>
            <span className="inline-block text-2xl font-bold">
              {data?.trendingBooks || 0}
            </span>
            <span className="inline-block text-xl text-gray-500 font-semibold">
              {data?.trendingBooksPercent || "0%"}
            </span>
            <span className="block text-gray-500">
              Trending Books in This Month
            </span>
          </div>
        </div>

        <div
          className="flex items-center p-8 bg-white shadow rounded-lg cursor-pointer hover:bg-blue-50"
          onClick={() => navigate("/dashboard/orders")}
        >
          <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
            <MdIncompleteCircle className="size-6" />
          </div>
          <div>
            <span className="block text-2xl font-bold">{totalOrders}</span>
            <span className="block text-gray-500">Total Orders</span>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-3 xl:grid-flow-col gap-6">
        <div className="flex flex-col md:col-span-2 md:row-span-2 bg-white shadow rounded-lg">
          <div className="px-6 py-5 font-semibold border-b border-gray-100">
            The number of orders per month
          </div>
          <div className="p-4 flex-grow">
            <div className="flex items-center justify-center h-full px-4 py-16 text-gray-400 text-3xl font-semibold bg-gray-100 border-2 border-gray-200 border-dashed rounded-md">
              <RevenueChart orders={data.allOrders || []} />
            </div>
          </div>
        </div>
        <div className="flex items-center p-8 bg-white shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-yellow-600 bg-yellow-100 rounded-full mr-6">
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path
                fill="#fff"
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
              />
            </svg>
          </div>
          <div>
            <span className="block text-2xl font-bold">{ordersLeft}</span>
            <span className="block text-gray-500">Orders left</span>
          </div>
        </div>

        <div className="flex items-center p-8 bg-white shadow rounded-lg">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-teal-600 bg-teal-100 rounded-full mr-6">
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <VisitCounter />
        </div>

        <div className="row-span-3 bg-white shadow-lg rounded-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 font-semibold border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
            <span className="text-lg text-purple-800">Upcoming Promotions</span>
            <button className="inline-flex items-center justify-center rounded-md px-3 py-1 bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition">
              View All
              <svg
                className="ml-1 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable promotions list */}
          <div className="overflow-y-auto flex-1 p-6">
            <ul className="space-y-4">
              {/* Winter Sale */}
              <li className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="h-12 w-12 mr-4 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-sm">
                  40%
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-blue-900">
                    Winter Sale
                  </span>
                  <p className="text-sm text-gray-500">
                    Discount on all fiction & non-fiction books
                  </p>
                </div>
                <span className="ml-auto text-gray-600 font-medium">
                  Starts: 10 Dec
                </span>
              </li>

              {/* Diwali Sale */}
              <li className="flex items-center bg-yellow-50 p-3 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="h-12 w-12 mr-4 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-800 font-bold text-sm">
                  50%
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-yellow-900">
                    Diwali Sale
                  </span>
                  <p className="text-sm text-gray-500">
                    Special festive discounts on bestsellers
                  </p>
                </div>
                <span className="ml-auto text-gray-600 font-medium">
                  Starts: 1 Nov
                </span>
              </li>

              {/* New Arrivals */}
              <li className="flex items-center bg-pink-50 p-3 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="h-12 w-12 mr-4 bg-pink-200 rounded-full flex items-center justify-center text-pink-800 font-bold text-sm">
                  NEW
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-pink-900">
                    New Arrivals
                  </span>
                  <p className="text-sm text-gray-500">
                    Highlight newly released books
                  </p>
                </div>
                <span className="ml-auto text-gray-600 font-medium">
                  Starts: 20 Oct
                </span>
              </li>

              {/* Bookworm Loyalty Offer */}
              <li className="flex items-center bg-teal-50 p-3 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="h-12 w-12 mr-4 bg-teal-200 rounded-full flex items-center justify-center text-teal-800 font-bold text-xs text-center">
                  BWL
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-teal-900">
                    Bookworm Loyalty Offer
                  </span>
                  <p className="text-sm text-gray-500">
                    Special discounts for loyal buyers
                  </p>
                </div>
                <span className="ml-auto text-gray-600 font-medium">
                  Starts: 5 Nov
                </span>
              </li>

              {/* Author Specials */}
              <li className="flex items-center bg-purple-50 p-3 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="h-12 w-12 mr-4 bg-purple-200 rounded-full flex items-center justify-center text-purple-800 font-bold text-sm">
                  30%
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-purple-900">
                    Author Specials
                  </span>
                  <p className="text-sm text-gray-500">
                    Discounts on books by featured authors
                  </p>
                </div>
                <span className="ml-auto text-gray-600 font-medium">
                  Starts: 15 Oct
                </span>
              </li>

              {/* Bulk Purchase Discount */}
              <li className="flex items-center bg-green-50 p-3 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="h-12 w-12 mr-4 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">
                  25%
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-green-900">
                    Bulk Purchase Discount
                  </span>
                  <p className="text-sm text-gray-500">
                    Buy 10+ books and save more
                  </p>
                </div>
                <span className="ml-auto text-gray-600 font-medium">
                  Starts: 1 Nov
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="row-span-3 bg-white shadow-lg rounded-xl overflow-hidden flex flex-col border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 font-semibold border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
            <span className="text-lg text-purple-800 font-semibold">
              ✨ Top-Selling Books
            </span>
            <button className="inline-flex items-center justify-center rounded-md px-3 py-1 bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition">
              View All
              <svg
                className="ml-1 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable Book List */}
          <div className="overflow-y-auto flex-1 p-6">
            <ul className="space-y-5">
              {[
                {
                  img: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1627042661i/58613224.jpg",
                  title: "Harry Potter and the Deathly Hallows",
                  author: "J.K. Rowling",
                  sold: "120 sold",
                },
                {
                  img: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1717605733i/214294239.jpg",
                  title: "Hikaru ga Shinda Natsu 5",
                  author: "Mokumokuren",
                  sold: "115 sold",
                },
                {
                  img: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1744302389i/222156817.jpg",
                  title: "Silenced Voices",
                  author: "Pablo Leon",
                  sold: "98 sold",
                },
                {
                  img: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1607321994i/53137955.jpg",
                  title: "Too Good to Be True",
                  author: "Carola Lovering",
                  sold: "85 sold",
                },
                {
                  img: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1680629184i/124950497.jpg",
                  title: "Ikigai",
                  author: "Héctor García",
                  sold: "72 sold",
                },
                {
                  img: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
                  title: "The Alchemist",
                  author: "Paulo Coelho",
                  sold: "70 sold",
                },
              ].map((book, index) => (
                <li
                  key={index}
                  className="flex items-center bg-purple-50 hover:bg-purple-100 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div className="h-24 w-16 mr-5 rounded-md overflow-hidden shadow-md ring-1 ring-purple-200 hover:ring-purple-300 transition-all duration-300">
                    <img
                      src={book.img}
                      alt={book.title}
                      className="h-full w-full object-cover transform hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-purple-900 block text-lg">
                      {book.title}
                    </span>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <span className="ml-auto text-sm font-semibold bg-purple-100 text-purple-800 px-3 py-1 rounded-full shadow-sm">
                    {book.sold}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="text-right font-semibold text-gray-500">
        <a href="#" className="text-purple-600 hover:underline">
          Recreated on Codepen
        </a>{" "}
        with{" "}
        <a
          href="https://tailwindcss.com/"
          className="text-teal-400 hover:underline"
        >
          Tailwind CSS
        </a>{" "}
        by Azri Kahar,{" "}
        <a
          href="https://dribbble.com/shots/10711741-Free-UI-Kit-for-Figma-Online-Courses-Dashboard"
          className="text-purple-600 hover:underline"
        >
          original design
        </a>{" "}
        made by Chili Labs
      </section>
    </>
  );
};

export default Dashboard;

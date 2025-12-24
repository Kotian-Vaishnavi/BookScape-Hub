import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import getBaseUrl from "../../utils/baseURL";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all"); // "all" means no filter

  const updatePendingCount = (ordersArray) => {
    const count = ordersArray.reduce((acc, order) => {
      return (
        acc +
        order.orderItems.filter(
          (item) => (item.status || "pending") === "pending"
        ).length
      );
    }, 0);

    try {
      localStorage.setItem("seller_pending_count", String(count));
    } catch (err) {
      console.error("Error setting localStorage seller_pending_count:", err);
    }

    window.dispatchEvent(
      new CustomEvent("sellerPendingUpdated", { detail: { count } })
    );
  };

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${getBaseUrl()}/api/orders/seller-orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const allOrders = res.data.orders || [];
        setOrders(allOrders);
        updatePendingCount(allOrders);
      } catch (err) {
        console.error("Error fetching seller orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerOrders();
  }, []);

  const handleStatusChange = async (orderId, itemId, newStatus) => {
    try {
      await axios.put(
        `${getBaseUrl()}/api/orders/update-item-status/${orderId}/${itemId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedOrders = orders.map((order) =>
        order._id === orderId
          ? {
              ...order,
              orderItems: order.orderItems.map((item) =>
                item._id === itemId ? { ...item, status: newStatus } : item
              ),
            }
          : order
      );

      setOrders(updatedOrders);
      updatePendingCount(updatedOrders);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) return <Loading />;

  if (!orders.length)
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-black">No orders found</h2>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Orders Received</h1>

      {/* Status Filter Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-semibold text-gray-700">
          Filter by Status:
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                User Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Product
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) =>
              order.orderItems
                .filter((item) =>
                  statusFilter === "all"
                    ? true
                    : (item.status || "pending") === statusFilter
                )
                .map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order._id || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.bookId?.title || item.bookId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{item.totalAmount || item.totalPrice || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={item.status ?? "pending"}
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            item._id,
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="canceled">Canceled</option>
                      </select>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerOrders;

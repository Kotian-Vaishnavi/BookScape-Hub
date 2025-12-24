// src/components/RevenueChart.jsx
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = ({ orders, sellerId }) => {
  // Dummy data till September
  const dummyOrders = [
    { _id: "d1", createdAt: "2025-01-10", totalAmount: 500, sellerId },
    { _id: "d2", createdAt: "2025-02-12", totalAmount: 800, sellerId },
    { _id: "d3", createdAt: "2025-03-05", totalAmount: 1200, sellerId },
    { _id: "d4", createdAt: "2025-04-15", totalAmount: 1100, sellerId },
    { _id: "d5", createdAt: "2025-05-20", totalAmount: 1000, sellerId },
    { _id: "d6", createdAt: "2025-06-25", totalAmount: 900, sellerId },
    { _id: "d7", createdAt: "2025-07-08", totalAmount: 1100, sellerId },
    { _id: "d8", createdAt: "2025-08-18", totalAmount: 1300, sellerId },
    { _id: "d9", createdAt: "2025-09-30", totalAmount: 950, sellerId },
  ];

  const chartData = useMemo(() => {
    // Merge real orders with dummy orders
    const combinedOrders = [...(orders || []), ...dummyOrders];

    if (!combinedOrders || combinedOrders.length === 0) return null;

    const revenueByMonth = Array(12).fill(0);

    combinedOrders.forEach((order) => {
      const monthIndex = new Date(order.createdAt).getMonth();

      // Use totalAmount if available, otherwise sum orderItems
      const orderTotal =
        order.totalAmount ||
        order.totalPrice ||
        order.orderItems?.reduce(
          (sum, item) => sum + Number(item.totalPrice || 0),
          0
        );

      revenueByMonth[monthIndex] += Number(orderTotal || 0);
    });

    return {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Revenue (₹)",
          data: revenueByMonth,
          backgroundColor: "rgba(34,197,94,0.7)",
          borderColor: "rgba(34,197,94,1)",
          borderWidth: 1,
        },
      ],
    };
  }, [orders, sellerId]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Revenue" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  if (!chartData)
    return (
      <div className="text-center py-10 text-gray-500">No revenue data</div>
    );

  return (
    <div className="w-full p-4 bg-white shadow-lg rounded-lg">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RevenueChart;

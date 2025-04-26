import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Breadcrumb from "../common/Breadcrumb"; // Adjust path as needed
import { AdminBaseURL } from "../config/config";

function DashboardItems({ h3, span, text, bg }) {
  return (
    <div
      className="h-48 p-5 rounded-md shadow-lg"
      style={{ backgroundColor: bg }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-[25px] text-white font-bold">
          {h3} <span className="text-[18px]">{span}</span>
        </h3>
        <span>
          <svg
            fill="white"
            className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 512"
          >
            <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
          </svg>
        </span>
      </div>
      <h3 className="text-[22px] font-semibold text-white">{text}</h3>
    </div>
  );
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    productCount: 0,
    usersCount: 0,
    orderCount: 0,
    discountCount: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, usersRes, ordersRes, discountsRes] =
          await Promise.all([
            axios.get(AdminBaseURL + "/dashboard/product-view"),
            axios.get(AdminBaseURL + "/dashboard/user-view"),
            axios.get(AdminBaseURL + "/dashboard/order-view"),
            axios.get(AdminBaseURL + "/dashboard/discount-view"),
          ]);

        setDashboardData({
          productCount: productsRes.data?.totalProducts || 0,
          usersCount: usersRes.data?.totalUsers || 0,
          orderCount: ordersRes.data?.totalOrders || 0,
          discountCount: discountsRes.data?.DiscountCoupon || 0,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  // Prepare data for the chart
  const chartData = [
    { name: "Users", value: dashboardData.usersCount },
    { name: "Products", value: dashboardData.productCount },
    { name: "Orders", value: dashboardData.orderCount },
    { name: "Discounts", value: dashboardData.discountCount },
  ];

  return (
    <>
      <Breadcrumb path={"Dashboard"} />
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1350px] mx-auto py-5">
          <div className="grid grid-cols-3 gap-5 mb-8">
            <DashboardItems
              h3={"Total Users Active"}
              text={dashboardData.usersCount}
              bg={"#5956D3"}
            />
            <DashboardItems
              h3={"Total Products in Store"}
              text={dashboardData.productCount}
              bg={"#2998FE"}
            />
            <DashboardItems
              h3={"Total Discounts Coupon Available"}
              text={dashboardData.discountCount}
              bg={"#FCB01E"}
            />
            <DashboardItems
              h3={"Total Orders"}
              text={dashboardData.orderCount}
              bg={"#E95353"}
            />
          </div>

          {/* Graph Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Dashboard Overview
              </h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition">
                  Weekly
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition">
                  Monthly
                </button>
              </div>
            </div>

            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                  layout="vertical" // Makes bars horizontal
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("en").format(value)
                    }
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontWeight: 500 }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      border: "none",
                    }}
                    formatter={(value) => [
                      new Intl.NumberFormat("en").format(value),
                      "Count",
                    ]}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    name="Count"
                    fill="url(#colorValue)"
                    radius={[0, 4, 4, 0]}
                    animationDuration={2000}
                    animationEasing="ease-out"
                  >
                    {chartData.map((entry, index) => (
                      <text
                        x={entry.value + 15}
                        y={index * 100 + 25}
                        textAnchor="start"
                        dominantBaseline="middle"
                        fill="#4f46e5"
                        fontWeight="600"
                      >
                        {new Intl.NumberFormat("en").format(entry.value)}
                      </text>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex justify-end">
              <span className="text-sm text-gray-500">Updated just now</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

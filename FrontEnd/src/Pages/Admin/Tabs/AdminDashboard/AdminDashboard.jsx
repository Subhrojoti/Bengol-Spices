import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getDashboardSummary } from "../../../../api/services";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardSummary();
        if (res.success) {
          setData(res.summary);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!data) return null;

  const { counts, orderStats, revenue } = data;

  const chartData = revenue.monthlyBreakdown.map((item) => ({
    month: item.month,
    revenue: item.revenue,
  }));

  const orderStatusData = [
    { name: "Delivered", value: orderStats.delivered },
    { name: "Pending", value: orderStats.pending },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Admin Dashboard
      </h1>

      {/* ================= KPI GRID ================= */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: "Orders", value: counts.orders },
          { label: "Agents", value: counts.agents },
          { label: "Employees", value: counts.employees },
          { label: "Stores", value: counts.stores },
          { label: "Products", value: counts.products },
          { label: "Delivery Partners", value: counts.deliveryPartners },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <p className="text-sm text-gray-500">{item.label}</p>
            <h2 className="text-2xl font-semibold mt-2">
              {item.value.toLocaleString()}
            </h2>
          </div>
        ))}
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-3 gap-6">
        {/* ===== Revenue Chart ===== */}
        <div className="col-span-2 bg-white rounded-3xl shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-6">
            Monthly Revenue ({revenue.year})
          </h2>

          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />

                <YAxis
                  tickFormatter={(v) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    `${revenue.currency} ${value.toLocaleString()}`
                  }
                />

                <Legend />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fill="url(#rev)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== Order Status Donut ===== */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-6">
          <h3 className="text-md font-semibold mb-6">Order Status</h3>

          <div className="h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  innerRadius={70}
                  outerRadius={100}
                  dataKey="value">
                  {orderStatusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Delivered</span>
              <span className="font-medium">{orderStats.delivered}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="font-medium">{orderStats.pending}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Footer Info ================= */}
      <div className="mt-8 text-sm text-gray-500">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import dashboardData from "./DashboardSummary.json";

export default function AdminDashboard() {
  const { summary, revenue } = dashboardData;

  const chartData = revenue.monthlyBreakdown.map((item, index) => ({
    month: item.month,
    revenue: item.revenue,
    delivered: Math.round(summary.ordersDelivered / 12 + index * 20),
    pending: Math.round(summary.ordersPending / 12 + index * 10),
  }));

  const weeklyData = [
    { day: "M", value: 50 },
    { day: "T", value: 40 },
    { day: "W", value: 35 },
    { day: "T", value: 60 },
    { day: "F", value: 55 },
    { day: "S", value: 20 },
    { day: "S", value: 10 },
  ];

  const donutData = [
    { name: "Delivered", value: summary.ordersDelivered },
    { name: "Pending", value: summary.ordersPending },
  ];

  const COLORS = ["#3b82f6", "#ef4444"];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Analytics Overview
      </h1>

      {/* ================= KPI CARDS ================= */}
      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* ===== Orders (Mini Bar Trend) ===== */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Orders</p>
          <h2 className="text-2xl font-semibold mt-2 mb-4">
            {summary.totalOrders.toLocaleString()}
          </h2>

          <div className="h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(-6)}>
                <Bar dataKey="delivered" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== Agents (Progress Bar Style) ===== */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Agents</p>
          <h2 className="text-2xl font-semibold mt-2 mb-4">
            {summary.totalAgents}
          </h2>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{
                width: `${(summary.totalAgents / 100) * 100}%`,
              }}
            />
          </div>

          <p className="text-xs text-gray-400 mt-2">Capacity Utilization</p>
        </div>

        {/* ===== Employees (Mini Donut) ===== */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Employees</p>
          <h2 className="text-2xl font-semibold mt-2 mb-4">
            {summary.totalEmployees}
          </h2>

          <div className="h-[90px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { name: "Active", value: summary.totalEmployees },
                    { name: "Remaining", value: 100 - summary.totalEmployees },
                  ]}
                  innerRadius={30}
                  outerRadius={45}
                  dataKey="value">
                  <Cell fill="#f59e0b" />
                  <Cell fill="#e5e7eb" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-3 gap-6">
        {/* ===== Large Area Chart ===== */}
        <div className="col-span-2 bg-white rounded-3xl shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-6">
            Revenue & Orders Overview
          </h2>

          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>

                  <linearGradient id="del" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>

                  <linearGradient id="pen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                <XAxis dataKey="month" />

                {/* Revenue Axis */}
                <YAxis
                  yAxisId="left"
                  tickFormatter={(v) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v
                  }
                />

                {/* Orders Axis */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(v) => v}
                />

                <Tooltip formatter={(value) => value.toLocaleString()} />

                <Legend />

                {/* Revenue */}
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fill="url(#rev)"
                  strokeWidth={2}
                  yAxisId="left"
                />

                {/* Delivered */}
                <Area
                  type="monotone"
                  dataKey="delivered"
                  stroke="#22c55e"
                  fill="url(#del)"
                  strokeWidth={2}
                  yAxisId="right"
                />

                {/* Pending */}
                <Area
                  type="monotone"
                  dataKey="pending"
                  stroke="#ef4444"
                  fill="url(#pen)"
                  strokeWidth={2}
                  yAxisId="right"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== Right Side Widgets ===== */}
        <div className="space-y-6">
          {/* Donut Chart */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h3 className="text-md font-semibold mb-4">Order Status</h3>

            <div className="h-[220px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={donutData}
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value">
                    {donutData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Bar Chart */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h3 className="text-md font-semibold mb-4">Orders Opened Daily</h3>

            <div className="h-[200px]">
              <ResponsiveContainer>
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Heatmap */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h3 className="text-md font-semibold mb-4">Orders Opening Time</h3>

            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 rounded-md"
                  style={{
                    backgroundColor: `rgba(59,130,246,${Math.random() * 0.8})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

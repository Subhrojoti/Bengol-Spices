import React from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
  Cell,
  PolarAngleAxis,
} from "recharts";

import deliveryData from "./deliveryDashboardMock.json";

const DeliveryPanel = () => {
  const { summary } = deliveryData;

  const monthlyData = summary.revenue.monthlyBreakdown;
  const yearlyData = summary.yearlyComparison;

  const deliveredTrend = monthlyData.map((m) => ({
    month: m.month,
    value: m.delivered,
  }));

  const returnTrend = monthlyData.map((m) => ({
    month: m.month,
    value: m.returns,
  }));

  const pendingTrend = monthlyData.map((m) => ({
    month: m.month,
    value: m.pending,
  }));

  const revenuePieData = [
    { name: "Revenue", value: summary.revenue.totalRevenue },
    { name: "Remaining Target", value: 2500000 - summary.revenue.totalRevenue },
  ];

  const COLORS = ["#3b82f6", "#e5e7eb"];

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-10">
      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-6 max-w-8xl mx-auto">
        {/* Delivered */}
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Delivered</p>
          <h2 className="text-2xl font-bold text-green-600 mb-3">
            {summary.deliveryStats.totalDelivered}
          </h2>

          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={deliveredTrend}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Returns */}
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Returns</p>
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            {summary.deliveryStats.totalReturns}
          </h2>

          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={returnTrend}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Pending Orders</p>
          <h2 className="text-2xl font-bold text-yellow-600 mb-3">
            {summary.deliveryStats.totalPendingOrders}
          </h2>

          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={pendingTrend}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#eab308"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
          <p className="text-gray-500 text-sm">Revenue Generated</p>
          <h2 className="text-2xl font-bold text-blue-600 mb-3">
            ₹{summary.revenue.totalRevenue.toLocaleString()}
          </h2>

          <ResponsiveContainer width="100%" height={80}>
            <PieChart>
              <Pie
                data={revenuePieData}
                innerRadius={28}
                outerRadius={40}
                dataKey="value">
                {revenuePieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MAIN STACKED AREA CHART */}
      <div className="bg-white p-8 rounded-xl shadow max-w-8xl mx-auto">
        <h2 className="text-lg font-semibold mb-6">
          Monthly Delivery Distribution
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Area
              type="monotone"
              dataKey="delivered"
              stackId="1"
              stroke="#16a34a"
              fill="#22c55e"
              fillOpacity={0.7}
            />
            <Area
              type="monotone"
              dataKey="returns"
              stackId="1"
              stroke="#dc2626"
              fill="#ef4444"
              fillOpacity={0.7}
            />
            <Area
              type="monotone"
              dataKey="pending"
              stackId="1"
              stroke="#eab308"
              fill="#facc15"
              fillOpacity={0.7}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* YEARLY RADIAL COMPARISON */}
      <div className="bg-white p-8 rounded-xl shadow max-w-8xl mx-auto">
        <h2 className="text-lg font-semibold mb-6 text-center">
          Yearly Revenue Comparison
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <RadialBarChart
            innerRadius="20%"
            outerRadius="90%"
            data={yearlyData}
            startAngle={180}
            endAngle={0}>
            <PolarAngleAxis
              type="number"
              domain={[0, "dataMax"]}
              tick={false}
            />

            <Tooltip
              formatter={(value, name, props) => [
                `₹${value.toLocaleString()}`,
                "Revenue",
              ]}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.year}
            />

            <RadialBar
              dataKey="revenue"
              cornerRadius={10}
              fill="#6366f1"
              background
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Year Labels */}
        <div className="flex justify-center gap-20 mt-[-5rem]">
          {yearlyData.map((year) => (
            <div key={year.year} className="text-center">
              <p className="text-sm text-gray-500">{year.year}</p>
              <p className="font-semibold text-indigo-600">
                ₹{year.revenue.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryPanel;

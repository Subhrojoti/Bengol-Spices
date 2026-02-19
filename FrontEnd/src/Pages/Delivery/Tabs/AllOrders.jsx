import React, { useState, useRef, useEffect } from "react";
import ordersMockData from "../ordersMockData.json";
import { Chip } from "@mui/material";

const AllOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(ordersMockData[0]);

  const [status, setStatus] = useState("Delivered");
  const [openStatus, setOpenStatus] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenStatus(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-white px-8 py-6">
      {/* 50-50 Layout */}
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* ================= LEFT PANEL ================= */}
        <div className="w-full md:w-1/3 border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-[#0f766e] mb-6">
            Assigned Orders
          </h2>

          <div className="space-y-4">
            {ordersMockData.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`p-5 rounded-xl cursor-pointer transition-all duration-200 border
                  ${
                    selectedOrder.id === order.id
                      ? "border-[#0f766e] bg-teal-50 shadow-sm"
                      : "border-gray-200 hover:border-[#0f766e]"
                  }`}>
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm">{order.id}</p>

                  <Chip
                    size="small"
                    label={order.status}
                    sx={{
                      backgroundColor: "#0f766e",
                      color: "#fff",
                      fontSize: "0.7rem",
                    }}
                  />
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  {order.customerName}
                </p>

                <p className="font-bold mt-3">₹{order.totalAmount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="w-full md:w-2/3 border border-gray-200 rounded-2xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#0f766e]">
              Order Details
            </h2>

            {/* Status Dropdown */}
            <div className="relative flex items-center gap-2" ref={dropdownRef}>
              <span className="text-sm font-medium text-gray-700 leading-none">
                Status:
              </span>

              <button
                onClick={() => setOpenStatus(!openStatus)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition leading-none ${
                  status === "Shipped"
                    ? "bg-blue-100 text-blue-700"
                    : status === "Out for Delivery"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                }`}>
                {status}
              </button>

              {openStatus && (
                <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  {["Shipped", "Out for Delivery", "Delivered"].map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setStatus(item);
                        setOpenStatus(false);
                      }}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-2 text-sm mb-8">
            <p>
              <span className="font-medium">Customer:</span>{" "}
              {selectedOrder.customerName}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {selectedOrder.phone}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {selectedOrder.address}
            </p>
          </div>

          <hr className="mb-8" />

          {/* Items */}
          <h3 className="text-lg font-semibold text-[#0f766e] mb-4">Items</h3>

          <div className="space-y-3 mb-8">
            {selectedOrder.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between border-b pb-2 text-sm">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span className="font-semibold">₹{item.price}</span>
              </div>
            ))}
          </div>

          {/* Map Section */}
          <div className="mt-auto">
            <h3 className="text-lg font-semibold text-[#0f766e] mb-4">
              Location
            </h3>

            <div className="relative h-64 rounded-2xl bg-[#0f766e] flex items-center justify-center text-white text-3xl font-bold shadow-md">
              MAP
              <button
                onClick={() => window.open(selectedOrder.mapUrl, "_blank")}
                className="absolute top-4 right-4 bg-white text-[#0f766e] font-semibold px-4 py-1.5 rounded-lg shadow hover:bg-gray-100 transition">
                Open
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;

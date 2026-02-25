import React, { useState, useRef, useEffect } from "react";
import { Chip } from "@mui/material";
import {
  getDeliveryPartnerOrders,
  updateDeliveryStatus,
  generateDeliveryOtp,
  verifyDeliveryOtp,
} from "../../../api/services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaidIcon from "@mui/icons-material/Paid";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openStatus, setOpenStatus] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getDeliveryPartnerOrders();
      if (response?.success) {
        setOrders(response.data);
        if (response.data.length > 0) {
          setSelectedOrder(response.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedOrder) return;

    if (newStatus === "DELIVERED") {
      try {
        setOtpLoading(true);

        const response = await generateDeliveryOtp(selectedOrder.orderId);

        if (response?.success) {
          toast.success("OTP generated successfully");
          setShowOtpModal(true);
        } else {
          toast.error("Failed to generate OTP");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to generate OTP");
      } finally {
        setOtpLoading(false);
        setOpenStatus(false);
      }

      return;
    }

    await updateStatusApi(newStatus);
  };

  const updateStatusApi = async (statusToUpdate) => {
    try {
      const response = await updateDeliveryStatus(
        selectedOrder.orderId,
        statusToUpdate,
      );

      if (response?.success) {
        toast.success("Status updated successfully");

        const updatedOrders = orders.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, status: statusToUpdate }
            : order,
        );

        setOrders(updatedOrders);
        setSelectedOrder({
          ...selectedOrder,
          status: statusToUpdate,
        });
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Status update failed");
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter valid 6 digit OTP");
      return;
    }

    try {
      setOtpLoading(true);

      const verifyResponse = await verifyDeliveryOtp(
        selectedOrder.orderId,
        otp,
      );

      if (verifyResponse?.success) {
        toast.success("Order delivered successfully");

        const updatedOrders = orders.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, status: "DELIVERED" }
            : order,
        );

        setOrders(updatedOrders);

        setSelectedOrder({
          ...selectedOrder,
          status: "DELIVERED",
        });

        setShowOtpModal(false);
        setOtp("");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenStatus(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusOptions = ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

  const formatStatus = (status) => {
    return status?.replaceAll("_", " ");
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-white px-8 py-6">
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* LEFT PANEL */}
        <div className="w-full md:w-1/3 border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-[#0f766e] mb-6">
            Assigned Orders
          </h2>

          {loading ? (
            <p>Loading orders...</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-5 rounded-xl cursor-pointer transition-all duration-200 border ${
                    selectedOrder?._id === order._id
                      ? "border-[#0f766e] bg-teal-50 shadow-sm"
                      : "border-gray-200 hover:border-[#0f766e]"
                  }`}>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm">{order.orderId}</p>

                    <Chip
                      size="small"
                      label={formatStatus(order.status)}
                      sx={{
                        backgroundColor: "#0f766e",
                        color: "#fff",
                        fontSize: "0.7rem",
                      }}
                    />
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    {order.deliveryAddress.storeName}
                  </p>

                  <p className="font-bold mt-3">₹{order.totalAmount}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-2/3 border border-gray-200 rounded-2xl p-8 flex flex-col">
          {selectedOrder ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#0f766e]">
                  Order Details
                </h2>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setOpenStatus(!openStatus)}
                    className="px-4 py-2 text-sm font-semibold rounded-full bg-teal-100 text-teal-700">
                    {formatStatus(selectedOrder.status)}
                  </button>

                  {openStatus && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50">
                      {statusOptions.map((status) => (
                        <div
                          key={status}
                          onClick={() => handleStatusUpdate(status)}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                          {formatStatus(status)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2 text-sm mb-6">
                <p>
                  <span className="font-medium">Store:</span>{" "}
                  {selectedOrder.deliveryAddress.storeName}
                </p>
                <p>
                  <span className="font-medium">Owner:</span>{" "}
                  {selectedOrder.deliveryAddress.ownerName}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedOrder.deliveryAddress.phone}
                </p>
              </div>

              <hr className="mb-6" />

              {/* Items */}
              <h3 className="text-lg font-semibold text-[#0f766e] mb-4">
                Items
              </h3>

              <div className="space-y-3 mb-6">
                {selectedOrder.products.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between border-b pb-2 text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              {/* ================= PAYMENT SECTION ================= */}

              {/* TOTAL AMOUNT (Standalone) */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-gray-800 font-bold text-md">
                  <span>Total Amount</span>
                </div>

                <span className="text-lg font-semibold text-gray-900">
                  ₹{selectedOrder.totalAmount}
                </span>
              </div>

              {/* COMPACT INFO BLOCKS */}
              <div className="grid grid-cols-2 gap-2 text-sm mb-6">
                {/* Paid */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 16, color: "#6b7280" }}
                    />
                    <span>Paid</span>
                  </div>
                  <div className="font-semibold ext-gray-800">
                    ₹{selectedOrder.paidAmount}
                  </div>
                </div>

                {/* Due */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: "#6b7280" }} />
                    <span>Due</span>
                  </div>
                  <div className="font-semibold text-gray-800">
                    ₹{selectedOrder.dueAmount}
                  </div>
                </div>

                {/* Payment Mode */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <CreditCardIcon sx={{ fontSize: 16, color: "#6b7280" }} />
                    <span>Payment Mode</span>
                  </div>
                  <div className="font-medium text-gray-800">
                    {selectedOrder.paymentMode}
                  </div>
                </div>

                {/* Payment Status */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: "#6b7280" }} />
                    <span>Status</span>
                  </div>
                  <div className="font-medium text-gray-800">
                    {selectedOrder.paymentStatus}
                  </div>
                </div>
              </div>

              {/* MAP */}
              <div className="mt-auto">
                <h3 className="text-lg font-semibold text-[#0f766e] mb-4">
                  Location
                </h3>

                <div className="relative h-72 rounded-2xl overflow-hidden shadow-md">
                  <iframe
                    title="Order Location"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps?q=${selectedOrder.orderLocation.latitude},${selectedOrder.orderLocation.longitude}&z=15&output=embed`}></iframe>
                </div>
              </div>
            </>
          ) : (
            <p>Select an order to view details</p>
          )}
        </div>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold text-center mb-6 text-[#0f766e]">
              Enter Delivery OTP
            </h3>

            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="------"
            />

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                }}
                className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">
                Cancel
              </button>

              <button
                onClick={handleOtpSubmit}
                disabled={otpLoading}
                className="flex-1 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700">
                {otpLoading ? "Verifying..." : "Verify & Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;

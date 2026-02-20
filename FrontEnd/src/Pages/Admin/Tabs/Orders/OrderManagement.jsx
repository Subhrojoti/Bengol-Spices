import React, { useEffect, useMemo, useState } from "react";
import { getAllAgentOrders, confirmOrder } from "../../../../api/services";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedConsumer, setSelectedConsumer] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllAgentOrders();
      setOrders(res.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group by consumerId
  const consumers = useMemo(() => {
    const grouped = {};

    orders.forEach((order) => {
      if (!grouped[order.consumerId]) {
        grouped[order.consumerId] = {
          agentId: order.agentId,
          orders: [],
        };
      }
      grouped[order.consumerId].orders.push(order);
    });

    return grouped;
  }, [orders]);

  const consumerKeys = Object.keys(consumers);
  const selectedOrders = selectedConsumer
    ? consumers[selectedConsumer]?.orders
    : [];

  const toggleAccordion = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const statusColors = {
    PLACED: "bg-blue-500 text-white",
    CONFIRMED: "bg-indigo-600 text-white",
    ASSIGNED: "bg-purple-600 text-white",
    SHIPPED: "bg-orange-300 text-black",
    OUT_FOR_DELIVERY: "bg-yellow-400 text-black",
    DELIVERED: "bg-green-500 text-white",
    CANCELLED: "bg-red-600 text-white",
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      setConfirmingId(orderId);

      await confirmOrder(orderId);

      // Optimistically update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status: "CONFIRMED" } : order,
        ),
      );

      toast.success("Order confirmed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to confirm order");
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-blue-50">
      <div className="flex gap-8 h-[calc(100vh-4rem)]">
        {/* LEFT PANEL */}
        <div className="w-1/3 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800">Consumers</h2>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {consumerKeys.map((consumerId) => (
              <div
                key={consumerId}
                onClick={() => {
                  setSelectedConsumer(consumerId);
                  setExpandedOrder(null);
                }}
                className={`p-4 rounded-xl cursor-pointer border transition
                  ${
                    selectedConsumer === consumerId
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-blue-50 hover:bg-blue-100 border-blue-200"
                  }
                `}>
                <p className="font-semibold">Consumer ID: {consumerId}</p>
                <p className="text-sm opacity-80">
                  Agent ID: {consumers[consumerId].agentId}
                </p>
                <p className="text-sm opacity-70 mt-1">
                  Orders: {consumers[consumerId].orders.length}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-2/3 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800">Orders</h2>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {!selectedConsumer && (
              <p className="text-gray-400">Select a consumer to view orders.</p>
            )}

            {selectedOrders?.map((order) => {
              const isOpen = expandedOrder === order._id;

              return (
                <div
                  key={order._id}
                  className="border border-blue-200 rounded-xl overflow-hidden">
                  {/* Accordion Header (Collapsed View) */}
                  <div
                    onClick={() => toggleAccordion(order._id)}
                    className="p-4 cursor-pointer flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition">
                    <div>
                      <p className="font-semibold text-blue-700">
                        {order.orderId}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: ₹{order.totalAmount} | Due: ₹{order.dueAmount}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-bold ${
                          statusColors[order.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}>
                        {order.status.replaceAll("_", " ")}
                      </span>
                      <span className="text-blue-600 text-lg">
                        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </span>
                    </div>
                  </div>

                  {/* Accordion Body (Expanded View) */}
                  {isOpen && (
                    <div className="p-5 bg-white space-y-4 border-t border-blue-100">
                      {/* Full Details */}
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Consumer ID: {order.consumerId}</p>
                        <p>Agent ID: {order.agentId}</p>
                        <p>Paid: ₹{order.paidAmount}</p>
                        <p>Payment Mode: {order.paymentMode}</p>
                        <p>
                          Due Date:{" "}
                          {new Date(order.dueDate).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Products */}
                      <div>
                        <p className="font-medium text-blue-600 mb-2">
                          Products:
                        </p>

                        <div className="space-y-2">
                          {order.products.map((product) => (
                            <div
                              key={product._id}
                              className="bg-blue-50 p-3 rounded-md text-sm flex justify-between">
                              <span>
                                {product.name} ({product.quantity} {product.uom}
                                )
                              </span>
                              <span className="font-medium">
                                ₹{product.totalPrice}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        {order.status === "PLACED" && (
                          <button
                            onClick={() => handleConfirmOrder(order.orderId)}
                            disabled={confirmingId === order.orderId}
                            className={`px-4 py-2 rounded-lg text-white transition ${
                              confirmingId === order.orderId
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}>
                            {confirmingId === order.orderId
                              ? "Confirming..."
                              : "Confirm Order"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;

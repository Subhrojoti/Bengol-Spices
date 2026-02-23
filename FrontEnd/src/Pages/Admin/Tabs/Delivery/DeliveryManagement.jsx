import React, { useEffect, useMemo, useState } from "react";
import {
  getAllAgentOrders,
  getAllDeliveryPartners,
  assignOrderToPartner,
} from "../../../../api/services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeliveryManagement = () => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingPartners, setLoadingPartners] = useState(true);

  const [selectedState, setSelectedState] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assigningPartnerId, setAssigningPartnerId] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchPartners();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllAgentOrders();
      if (data?.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchPartners = async () => {
    try {
      const data = await getAllDeliveryPartners();
      if (data?.success) {
        setPartners(data.data);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoadingPartners(false);
    }
  };

  const states = useMemo(() => {
    const allStates = partners.map((p) => p.address?.state);
    return ["ALL", ...new Set(allStates)];
  }, [partners]);

  const filteredPartners = useMemo(() => {
    if (selectedState === "ALL") return partners;
    return partners.filter(
      (partner) => partner.address?.state === selectedState,
    );
  }, [partners, selectedState]);

  const handleAssign = async (partnerId) => {
    if (!selectedOrder) {
      toast.error("Please select an order first.");
      return;
    }

    try {
      setAssigningPartnerId(partnerId);

      const response = await assignOrderToPartner(
        selectedOrder.orderId,
        partnerId,
      );

      if (response?.success) {
        toast.success("Order assigned successfully!");

        // Optimistic UI Update
        const updatedOrders = orders.map((order) =>
          order._id === selectedOrder._id
            ? {
                ...order,
                delivery: { partnerId },
                status: "ASSIGNED",
              }
            : order,
        );

        setOrders(updatedOrders);

        setSelectedOrder({
          ...selectedOrder,
          delivery: { partnerId },
          status: "ASSIGNED",
        });
      } else {
        toast.error("Failed to assign order.");
      }
    } catch (error) {
      console.error("Assignment failed:", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setAssigningPartnerId(null);
    }
  };

  return (
    <div className="h-screen p-6 bg-gray-100">
      <div className="flex gap-6 h-full">
        {/* LEFT PANEL */}
        <div className="w-1/2 bg-white rounded-xl shadow-md p-5 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Orders to Assign
          </h2>

          <div className="overflow-y-auto space-y-4 flex-1 pr-2">
            {loadingOrders ? (
              <p>Loading Orders...</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    selectedOrder?._id === order._id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:shadow-md"
                  }`}>
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold text-sm">{order.orderId}</p>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      {order.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress.storeName}
                  </p>

                  <p className="text-xs text-gray-500">
                    {order.deliveryAddress.city}, {order.deliveryAddress.state}
                  </p>

                  <div className="mt-2 text-sm">
                    Total: ₹{order.totalAmount}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-1/2 bg-white rounded-xl shadow-md p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold">Delivery Partners</h2>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm">
              {states.map((state) => (
                <option key={state} value={state}>
                  {state === "ALL" ? "All States" : state}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-y-auto space-y-4 flex-1 pr-2">
            {loadingPartners ? (
              <p>Loading Partners...</p>
            ) : (
              filteredPartners.map((partner) => {
                const isAssignedToThisPartner =
                  selectedOrder?.delivery?.partnerId === partner._id;

                return (
                  <div
                    key={partner._id}
                    className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between mb-2">
                      <p className="font-semibold text-sm">{partner.name}</p>

                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {partner.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">{partner.phone}</p>

                    <p className="text-xs text-gray-500">
                      {partner.address.city}, {partner.address.state}
                    </p>

                    <button
                      onClick={() => handleAssign(partner._id)}
                      disabled={
                        !selectedOrder ||
                        isAssignedToThisPartner ||
                        assigningPartnerId === partner._id
                      }
                      className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition ${
                        isAssignedToThisPartner
                          ? "bg-green-600 text-white cursor-not-allowed"
                          : !selectedOrder
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}>
                      {assigningPartnerId === partner._id
                        ? "Assigning..."
                        : isAssignedToThisPartner
                          ? "Assigned"
                          : "Assign Order"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryManagement;

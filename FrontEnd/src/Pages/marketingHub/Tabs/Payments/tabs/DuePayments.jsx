import { useEffect, useState } from "react";
import {
  myStores,
  getDueOrders,
  collectOrderPayment,
} from "../../../../../api/services";
import StoreAccordion from "../components/StoreAccordian";
import PaymentModal from "../components/PaymentModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DuePayments = () => {
  const [stores, setStores] = useState([]);

  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const handleOpenPayment = (order) => {
    setSelectedOrder(order);
    setPaymentAmount(order.dueAmount);
    setOpenPaymentModal(true);
  };

  const handleClosePayment = () => {
    setOpenPaymentModal(false);
    setSelectedOrder(null);
  };

  const handleSubmitPayment = async () => {
    try {
      const payload = {
        amount: Number(paymentAmount),
        method: "CASH",
        note: "Payment collected",
      };

      await collectOrderPayment(selectedOrder.orderNo, payload);

      setStores((prevStores) =>
        prevStores.map((store) => ({
          ...store,
          orders: store.orders.map((order) =>
            order.orderNo === selectedOrder.orderNo
              ? {
                  ...order,
                  dueAmount: order.dueAmount - paymentAmount,
                  paymentStatus:
                    order.dueAmount - paymentAmount <= 0 ? "PAID" : "PARTIAL",
                }
              : order,
          ),
        })),
      );

      toast.success("Payment collected successfully");
      handleClosePayment();
    } catch (error) {
      console.error("Payment collection failed", error);
      toast.error("Failed to collect payment");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch store metadata (includes image, name, etc.)
        const storesRes = await myStores();
        const storesData = storesRes?.stores || [];

        // Fetch due orders (already filtered from backend)
        const dueOrdersRes = await getDueOrders();
        const dueOrders = dueOrdersRes?.data || [];

        // Group orders by consumerId (NO CANCELLED FILTER)
        const ordersMap = dueOrders.reduce((acc, order) => {
          const key = order.consumerId;

          if (!acc[key]) acc[key] = [];

          acc[key].push({
            orderNo: order.orderId,
            orderId: order.orderId,
            deliveryAddress: order.deliveryAddress,
            paymentStatus: order.paymentStatus,
            dueAmount: order.dueAmount,
            totalAmount: order.totalAmount,
            status: order.status,
          });

          return acc;
        }, {});

        // Merge stores with their respective due orders
        const storesWithOrders = storesData.map((store) => ({
          ...store,
          orders: ordersMap[store.consumerId] || [],
        }));

        // OPTIONAL: hide stores with no due orders
        const filteredStores = storesWithOrders.filter(
          (store) => store.orders.length > 0,
        );

        setStores(filteredStores);
      } catch (err) {
        console.error("Failed to fetch due payments data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {stores.map((store, index) => (
        <StoreAccordion
          key={index}
          store={store}
          onPayNow={handleOpenPayment}
        />
      ))}

      <PaymentModal
        open={openPaymentModal}
        onClose={handleClosePayment}
        order={selectedOrder}
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
        onSubmit={handleSubmitPayment}
      />
    </div>
  );
};

export default DuePayments;

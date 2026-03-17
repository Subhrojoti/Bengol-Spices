import { useEffect, useState } from "react";
import { myStores, getStoreOrders } from "../../../../../api/services";
import StoreAccordion from "../components/StoreAccordian";
import { Typography } from "@mui/material";

const CompletedPayments = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch store metadata
        const storesRes = await myStores();
        const storesData = storesRes?.stores || [];

        // 2️⃣ Fetch orders per store
        const storesWithOrders = await Promise.all(
          storesData.map(async (store) => {
            try {
              const ordersRes = await getStoreOrders(store.consumerId);

              const orders =
                ordersRes?.orders
                  ?.filter((order) => order.paymentStatus === "COMPLETED") // ✅ correct filter
                  .map((order) => ({
                    orderNo: order.orderId,
                    orderId: order.orderId,
                    deliveryAddress: order.deliveryAddress,
                    paymentStatus: order.paymentStatus,
                    dueAmount: order.dueAmount,
                    totalAmount: order.totalAmount,
                    status: order.status,
                  })) || [];

              return {
                ...store,
                orders,
              };
            } catch (err) {
              console.error(
                "Error fetching orders for store:",
                store.storeName,
              );

              return {
                ...store,
                orders: [],
              };
            }
          }),
        );

        // 3️⃣ Remove empty stores
        const filteredStores = storesWithOrders.filter(
          (store) => store.orders.length > 0,
        );

        setStores(filteredStores);
      } catch (err) {
        console.error("Failed to fetch completed payments", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {stores.length === 0 ? (
        <Typography align="center" sx={{ mt: 4 }}>
          No completed payments available
        </Typography>
      ) : (
        stores.map((store, index) => (
          <StoreAccordion
            key={index}
            store={store}
            onPayNow={() => {}} // no payment action needed
          />
        ))
      )}
    </div>
  );
};

export default CompletedPayments;

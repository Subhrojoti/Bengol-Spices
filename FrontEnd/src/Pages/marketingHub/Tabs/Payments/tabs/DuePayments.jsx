import { useEffect, useState } from "react";
import { myStores, getStoreOrders } from "../../../../../api/services";
import StoreAccordion from "../components/StoreAccordian";

const DuePayments = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await myStores();
        const storesData = res?.stores || [];

        const storesWithOrders = await Promise.all(
          storesData.map(async (store) => {
            try {
              const ordersRes = await getStoreOrders(store.consumerId);

              const orders =
                ordersRes?.orders?.map((order) => ({
                  orderNo: order.orderId,
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

        setStores(storesWithOrders);
      } catch (err) {
        console.error("Failed to fetch stores", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {stores.map((store, index) => (
        <StoreAccordion key={index} store={store} />
      ))}
    </div>
  );
};

export default DuePayments;

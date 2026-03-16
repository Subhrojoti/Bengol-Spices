import StoreAccordion from "../components/StoreAccordian";

const mockData = [
  {
    storeName: "Store X",
    ownerName: "Mike",
    orders: [
      { orderNo: "ord2026-200", paymentStatus: "Overdue" },
      { orderNo: "ord2026-201", paymentStatus: "Overdue" },
    ],
  },
];

const OverduePayments = () => {
  return (
    <div>
      {mockData.map((store, index) => (
        <StoreAccordion key={index} store={store} />
      ))}
    </div>
  );
};

export default OverduePayments;

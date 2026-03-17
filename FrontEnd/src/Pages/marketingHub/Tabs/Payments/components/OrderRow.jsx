import { Button } from "@mui/material";

const OrderRow = ({ order, onPayNow }) => {
  return (
    <div className="flex justify-between items-center border border-gray-200 rounded-lg p-4 bg-white">
      <p className="font-medium text-gray-800">{order.orderNo}</p>

      <div className="flex items-center gap-4">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
          {order.paymentStatus}
        </span>
        <Button
          variant="contained"
          size="small"
          onClick={
            order.paymentStatus !== "COMPLETED"
              ? () => onPayNow(order)
              : undefined
          }
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 500,
            px: 2,
            backgroundColor:
              order.paymentStatus === "COMPLETED" ? "#40ac67" : undefined,
            "&:hover": {
              backgroundColor:
                order.paymentStatus === "COMPLETED" ? "#40ac67" : undefined,
            },
          }}>
          {order.paymentStatus === "COMPLETED" ? "PAID" : "Pay Now"}
        </Button>
      </div>
    </div>
  );
};

export default OrderRow;

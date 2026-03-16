import { Button } from "@mui/material";

const OrderRow = ({ order }) => {
  return (
    <div className="flex justify-between items-center border border-gray-200 rounded-lg p-4 bg-white">
      {/* Order Number */}
      <p className="font-medium text-gray-800">{order.orderNo}</p>

      {/* Status + Button */}
      <div className="flex items-center gap-4">
        {/* order Status for testing */}
        {/* <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
          {order.status}
        </span> */}
        {/* Payment Status */}
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
          {order.paymentStatus}
        </span>

        {/* Pay Button */}
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 500,
            px: 2,
          }}>
          Pay Now
        </Button>
      </div>
    </div>
  );
};

export default OrderRow;

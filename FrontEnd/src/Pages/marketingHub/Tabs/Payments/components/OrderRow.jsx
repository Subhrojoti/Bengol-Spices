import { Button, Tooltip, IconButton } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { downloadInvoice } from "../../../../../api/services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderRow = ({ order, onPayNow }) => {
  const handleDownloadInvoice = async () => {
    try {
      const res = await downloadInvoice(order.orderNo);

      // Case 1: No data or empty file
      if (!res || !res.data || res.data.size === 0) {
        toast.error("Invoice not available");
        return;
      }

      // Create file URL
      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${order.orderNo}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      // Case 2: API error (404 / 500 / etc.)
      console.error("Invoice download error:", err);

      toast.error(err?.response?.data?.message || "Invoice not available");
    }
  };

  return (
    <div className="flex justify-between items-center border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition">
      {/* LEFT: Order Info */}
      <div className="flex flex-col">
        {/* Order No */}
        <p className="font-semibold text-gray-800 text-sm md:text-base">
          {order.orderNo}
        </p>

        {/* Date */}
        <p className="text-xs text-gray-500">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* CENTER: Amounts */}
      <div className="flex items-center gap-6">
        {/* Total */}
        <div className="text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-sm font-semibold text-gray-800">
            ₹ {order.totalAmount}
          </p>
        </div>

        {/* Paid */}
        <div className="text-center">
          <p className="text-xs text-gray-500">Paid</p>
          <p className="text-sm font-semibold text-green-700">
            ₹ {order.paidAmount}
          </p>
        </div>

        {/* Due */}
        <div className="text-center">
          <p className="text-xs text-gray-500">Due</p>
          <p className="text-sm font-semibold text-yellow-700">
            ₹ {order.dueAmount}
          </p>
        </div>
      </div>

      {/* RIGHT: Status + Action */}
      <div className="flex items-center gap-4">
        {/* Status */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            order.paymentStatus === "COMPLETED"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
          {order.paymentStatus}
        </span>

        {/* Button */}
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

        {/* Download Invoice Icon */}
        <Tooltip title="Download invoice">
          <IconButton
            onClick={handleDownloadInvoice}
            size="small"
            sx={{
              color: "#626262",
              "&:hover": {
                color: "#515151",
              },
            }}>
            <DescriptionIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default OrderRow;

import { useState } from "react";
import { Avatar, Typography } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OrderRow from "./OrderRow";

const StoreAccordion = ({ store, onPayNow }) => {
  const [open, setOpen] = useState(false);

  const { storeName, ownerName, image, orders = [] } = store || {};

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 bg-white">
      {/* Accordion Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3 w-full">
          {/* Store Avatar */}
          <Avatar
            variant="rounded"
            src={image?.url || ""}
            sx={{
              width: 56,
              height: 56,
              bgcolor: "primary.main",
            }}>
            {!image?.url && <StorefrontIcon />}
          </Avatar>

          {/* Store Details */}
          <div className="flex-1">
            <Typography fontWeight={600}>{storeName}</Typography>

            <Typography variant="body2" color="text.secondary">
              Owner: {ownerName}
            </Typography>
          </div>

          {/* Order Count */}
          <div className="flex items-center gap-2 mr-2">
            Total Orders:
            <Typography fontWeight={600}>
              {orders.filter((order) => order.status !== "CANCELLED").length}
            </Typography>
          </div>

          {/* Expand Arrow */}
          <ExpandMoreIcon
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      {/* Accordion Body */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}>
        <div className="overflow-hidden">
          <div className="border-t bg-gray-50 px-4 py-3 space-y-2">
            {orders
              .filter((order) => order.status !== "CANCELLED")
              .map((order) => (
                <OrderRow
                  key={order.orderNo}
                  order={order}
                  onPayNow={onPayNow}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreAccordion;

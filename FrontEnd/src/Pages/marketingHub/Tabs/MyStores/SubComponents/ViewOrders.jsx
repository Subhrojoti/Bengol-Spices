import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Avatar,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Paper,
  IconButton,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ScheduleIcon from "@mui/icons-material/EventAvailable";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getStoreOrders } from "../../../../../api/services";

const CustomStepIcon = ({ active, completed, icon }) => {
  const isActive = active || completed;

  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: isActive ? "primary.main" : "#e5e7eb",
        color: isActive ? "primary.contrastText" : "#9ca3af",

        transition: "all 0.3s ease",
      }}>
      {icon}
    </Box>
  );
};

const ORDER_STATUS_FLOW = [
  "PLACED",
  "CONFIRMED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const STATUS_TO_STEP_INDEX = {
  PLACED: 0,
  CONFIRMED: 1,
  SHIPPED: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
};

const orderSteps = [
  { label: "Order Placed", icon: <ScheduleIcon /> },
  { label: "Confirmed", icon: <InventoryIcon /> },
  { label: "Shipped", icon: <InventoryIcon /> },
  { label: "Out for Delivery", icon: <LocalShippingIcon /> },
  { label: "Delivered", icon: <CheckCircleIcon /> },
];

const ViewOrders = ({ onBack, onCreate }) => {
  const selectedStore = useSelector((state) => state.myStoresUi.selectedStore);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {
    storeName,
    ownerName,
    phone,
    address,
    storeType,
    status,
    consumerId,
    location,
  } = selectedStore || {};
  const latitude = location?.latitude;
  const longitude = location?.longitude;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasOrders = !loading && orders.length > 0;
  const hasSelectedOrder = Boolean(selectedOrder);

  // API call
  useEffect(() => {
    if (!consumerId) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getStoreOrders(consumerId);

        setOrders(res?.orders || []);
      } catch (err) {
        console.error("Failed to fetch store orders", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [consumerId]);

  console.log("Long", longitude, "lat", latitude);

  const activeStep = hasSelectedOrder
    ? (STATUS_TO_STEP_INDEX[selectedOrder.status] ?? 0)
    : -1;

  const isCancelled = selectedOrder?.status === "CANCELLED";

  return (
    <Box
      display="flex"
      height="90vh"
      bgcolor="#f9fafb"
      p={2}
      gap={2}
      overflow="hidden">
      {/* ================= LEFT PANEL ================= */}
      <Box width={320} display="flex" flexDirection="column" gap={2}>
        {/* Store Info */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                variant="rounded"
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: "primary.main",
                }}>
                <StorefrontIcon />
              </Avatar>

              <Box>
                <Typography fontWeight={700}>{storeName || "—"}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {storeType || "—"}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Owner: {ownerName || "—"}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <RoomIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {address || "Address not available"}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {phone || "N/A"}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={status || "UNKNOWN"}
                  size="small"
                  color={status === "ACTIVE" ? "success" : "default"}
                />

                <Chip label={consumerId} size="small" variant="outlined" />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card
          sx={{
            flex: 1,
            borderRadius: 3,
            overflow: "hidden",
          }}>
          {latitude && longitude ? (
            <Box
              component="iframe"
              title="Store Location"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sx={{ border: 0 }}
              src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
            />
          ) : (
            <Box
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="#e5e7eb">
              <Typography color="text.secondary">
                Location not available
              </Typography>
            </Box>
          )}
        </Card>
      </Box>

      {/* ================= RIGHT PANEL ================= */}
      {hasOrders ? (
        <Box flex={1} display="flex" flexDirection="column" gap={3}>
          {/* Order Flow (No Background) */}
          <Box position="relative" px={2} py={1}>
            {/* HEADER ROW */}
            <Box display="flex" alignItems="center" mb={2}>
              {/* BACK BUTTON (TOP RIGHT) */}
              <IconButton onClick={onBack}>
                <ArrowBackIcon />
              </IconButton>
            </Box>

            {/* STEPPER */}
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                "& .MuiStepConnector-line": {
                  borderTopWidth: 2,
                  borderColor: !hasSelectedOrder ? "#e5e7eb" : undefined,
                },
                "& .MuiStepConnector-root": {
                  top: "30%",
                  transform: "translateY(-50%)",
                },
              }}>
              {orderSteps.map((step, index) => {
                const isActive = hasSelectedOrder && index === activeStep;

                const isCompleted =
                  hasSelectedOrder && !isCancelled && index < activeStep;

                return (
                  <Step key={step.label} completed={isCompleted}>
                    <StepLabel
                      StepIconComponent={(props) => (
                        <CustomStepIcon
                          {...props}
                          active={isActive}
                          completed={isCompleted}
                          icon={step.icon}
                        />
                      )}>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color={
                          !hasSelectedOrder
                            ? "text.disabled"
                            : isCancelled
                              ? "error.main"
                              : index <= activeStep
                                ? "primary"
                                : "text.secondary"
                        }>
                        {step.label}
                      </Typography>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Box>

          {/* Orders List */}
          <Paper
            sx={{
              flex: 1,
              p: 2,
              borderRadius: 3,
              overflowY: "auto",
            }}>
            <Stack spacing={2}>
              {/* Orders List */}
              <Paper
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 3,
                  overflowY: "auto",
                }}>
                {loading && (
                  <Typography color="text.secondary">
                    Loading orders...
                  </Typography>
                )}

                {!loading && !orders.length && (
                  <Typography color="text.secondary">
                    No orders found for this store.
                  </Typography>
                )}

                <Stack spacing={2}>
                  {orders.map((order) => (
                    <Card
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      sx={{
                        cursor: "pointer",
                        borderRadius: 2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        border:
                          selectedOrder?._id === order._id
                            ? "2px solid"
                            : "1px solid transparent",
                        borderColor:
                          selectedOrder?._id === order._id
                            ? "primary.main"
                            : "transparent",
                        transition: "all 0.2s ease",
                      }}>
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            variant="rounded"
                            src={order.products?.[0]?.image || ""}
                            sx={{
                              width: 64,
                              height: 64,
                              bgcolor: "#f3f4f6",
                            }}>
                            <InventoryIcon sx={{ color: "#9ca3af" }} />
                          </Avatar>

                          <Box flex={1}>
                            <Typography fontWeight={600}>
                              {order.products?.[0]?.name}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              Qty: {order.products?.[0]?.quantity}{" "}
                              {order.products?.[0]?.uom}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              ₹{order.products?.[0]?.unitPrice}
                            </Typography>
                          </Box>

                          <Box textAlign="right">
                            <Chip
                              label={order.status}
                              color={
                                order.status === "DELIVERED"
                                  ? "success"
                                  : "warning"
                              }
                              size="small"
                              sx={{ mb: 1 }}
                            />

                            <Typography fontWeight={700}>
                              ₹{order.totalAmount}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Paper>
        </Box>
      ) : (
        <Box
          flex={1}
          position="relative" // 🔑 anchor for back button
        >
          {/* BACK BUTTON — TRUE TOP LEFT OF RIGHT PANEL */}
          <IconButton
            onClick={onBack}
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 10,
            }}>
            <ArrowBackIcon />
          </IconButton>

          {/* CENTERED EMPTY STATE */}
          <Box
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center">
            <Box textAlign="center">
              <Typography fontWeight={700} fontSize={18} mb={1}>
                No orders in this store
              </Typography>

              <Typography color="text.secondary" mb={3} maxWidth={360}>
                There is no order in this store yet. Please create an order
                first to track its status.
              </Typography>

              <IconButton
                color="primary"
                onClick={onCreate}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  border: "1px solid",
                }}>
                Create Order
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ViewOrders;

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ScheduleIcon from "@mui/icons-material/EventAvailable";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { getStoreOrders, initiateReturn } from "../../../../../api/services";

/* ================= STEP ICON ================= */

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

/* ================= ORDER STEPS (Single Source of Truth) ================= */

const orderSteps = [
  { key: "PLACED", label: "Order Placed", icon: <ScheduleIcon /> },
  { key: "CONFIRMED", label: "Confirmed", icon: <InventoryIcon /> },
  { key: "ASSIGNED", label: "Assigned", icon: <InventoryIcon /> },
  { key: "SHIPPED", label: "Shipped", icon: <LocalShippingIcon /> },
  {
    key: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
    icon: <LocalShippingIcon />,
  },
  { key: "DELIVERED", label: "Delivered", icon: <CheckCircleIcon /> },
];

// Return Steps
const returnSteps = [
  { key: "INITIATED", label: "Return Initiated", icon: <ScheduleIcon /> },
  {
    key: "PICKUP_ASSIGNED",
    label: "Pickup Assigned",
    icon: <LocalShippingIcon />,
  },
  { key: "PICKED_UP", label: "Picked Up", icon: <LocalShippingIcon /> },
  {
    key: "RECEIVED_AT_WAREHOUSE",
    label: "Received at Warehouse",
    icon: <InventoryIcon />,
  },
  {
    key: "REFUND_PROCESSED",
    label: "Refund Processed",
    icon: <CheckCircleIcon />,
  },
  { key: "COMPLETED", label: "Return Completed", icon: <CheckCircleIcon /> },
  { key: "CANCELLED", label: "Return Cancelled", icon: <CheckCircleIcon /> },
];

/* ================= COMPONENT ================= */

const ViewOrders = ({ onBack, onCreate }) => {
  const selectedStore = useSelector((state) => state.myStoresUi.selectedStore);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isReturnFlow, setIsReturnFlow] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnStatus, setReturnStatus] = useState(null);

  const {
    storeName,
    ownerName,
    phone,
    address,
    storeType,
    status,
    consumerId,
    location,
    image,
  } = selectedStore || {};

  const latitude = location?.latitude;
  const longitude = location?.longitude;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const hasOrders = !loading && orders.length > 0;
  const hasSelectedOrder = Boolean(selectedOrder);

  /* ================= STATUS NORMALIZATION ================= */

  const normalizeStatus = (status) =>
    status?.trim()?.toUpperCase()?.replace(/-/g, "_");

  const normalizedStatus = normalizeStatus(selectedOrder?.status);

  const isCancelled = normalizedStatus === "CANCELLED";

  const activeStep = useMemo(() => {
    if (!hasSelectedOrder) return -1;

    if (isReturnFlow) {
      return returnSteps.findIndex((step) => step.key === returnStatus);
    }

    if (isCancelled) return -1;

    return orderSteps.findIndex((step) => step.key === normalizedStatus);
  }, [
    hasSelectedOrder,
    normalizedStatus,
    isCancelled,
    isReturnFlow,
    returnStatus,
  ]);

  /* ================= API CALL ================= */

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

  // Return flow and status
  useEffect(() => {
    setIsReturnFlow(false);
    setReturnStatus(null);
  }, [selectedOrder]);

  /* ================= UI ================= */

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
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                variant="rounded"
                src={image?.url || ""}
                sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
                {!image?.url && <StorefrontIcon />}
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
                  {address
                    ? `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`
                    : "Address not available"}
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

        <Card sx={{ flex: 1, borderRadius: 3, overflow: "hidden" }}>
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
          {/* ===== STEP FLOW ===== */}

          <Box position="relative" px={2} py={1}>
            <Box display="flex" alignItems="center" mb={2}>
              <IconButton onClick={onBack}>
                <ArrowBackIcon />
              </IconButton>
            </Box>

            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                "& .MuiStepConnector-line": { borderTopWidth: 2 },
                "& .MuiStepConnector-root": {
                  top: "30%",
                  transform: "translateY(-50%)",
                },
              }}>
              {(isReturnFlow ? returnSteps : orderSteps).map((step, index) => {
                const isActive = index === activeStep;
                const isCompleted =
                  hasSelectedOrder && !isCancelled && index < activeStep;

                return (
                  <Step key={step.key} completed={isCompleted}>
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

          {/* ===== ORDERS LIST ===== */}

          <Paper sx={{ flex: 1, p: 2, borderRadius: 3, overflowY: "auto" }}>
            {loading && (
              <Typography color="text.secondary">Loading orders...</Typography>
            )}

            {!loading && !orders.length && (
              <Typography color="text.secondary">
                No orders found for this store.
              </Typography>
            )}

            <Stack spacing={2}>
              {orders.map((order) => {
                const normalized = normalizeStatus(order.status);

                const chipColor =
                  normalized === "DELIVERED"
                    ? "success"
                    : normalized === "CANCELLED"
                      ? "error"
                      : "warning";

                return (
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
                            {order.orderId}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            Qty: {order.products?.[0]?.quantity}{" "}
                            {order.products?.[0]?.uom}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            ₹{order.products?.[0]?.unitPrice}
                          </Typography>
                        </Box>

                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          gap={1}>
                          {/* LEFT SIDE */}
                          {normalized === "DELIVERED" && (
                            <Chip
                              label="Return"
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: "primary.main",
                                color: "primary.main",
                                backgroundColor: "#fff",
                                fontWeight: 600,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                                setReturnModalOpen(true);
                              }}
                            />
                          )}

                          {/* RIGHT SIDE */}
                          <Box textAlign="right">
                            <Chip
                              label={order.status}
                              color={chipColor}
                              size="small"
                            />

                            <Typography fontWeight={700} mt={0.5}>
                              ₹{order.totalAmount}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </Paper>
        </Box>
      ) : (
        <Box flex={1} position="relative">
          <IconButton
            onClick={onBack}
            sx={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
            <ArrowBackIcon />
          </IconButton>

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
      <Dialog
        open={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        PaperProps={{
          sx: {
            width: 420,
            maxWidth: "90vw",
            borderRadius: 3,
          },
        }}>
        <DialogTitle>Reason for Return</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            placeholder="Enter reason..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                const res = await initiateReturn(
                  selectedOrder.orderId,
                  returnReason,
                );

                setReturnStatus("INITIATED");
                setIsReturnFlow(true);
                setReturnModalOpen(false);
                setReturnReason("");
              } catch (err) {
                console.error(err);
              }
            }}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewOrders;

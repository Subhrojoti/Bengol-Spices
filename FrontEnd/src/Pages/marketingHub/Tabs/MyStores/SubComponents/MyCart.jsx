import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { ShoppingCartOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  clearCart,
  removeFromCart,
} from "../../../../../redux/slices/addToCart/addToCart";
import { createOrder } from "../../../../../api/services";
import { setLeftView } from "../../../../../redux/slices/myStoresUi/myStoresUi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyCart = ({ onBack }) => {
  const dispatch = useDispatch();

  const [paymentMode, setPaymentMode] = useState("CASH");
  const [paidAmount, setPaidAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedStore = useSelector((state) => state.myStoresUi.selectedStore);
  const consumerId = selectedStore?.consumerId;

  const cartItems = useSelector((state) =>
    consumerId ? state.addToCart.carts[consumerId]?.items || [] : [],
  );

  const latitude = selectedStore?.location?.latitude;
  const longitude = selectedStore?.location?.longitude;

  /* ---------------- STORE VALIDATIONS ---------------- */

  if (!selectedStore) {
    return (
      <Box
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={2}
        p={4}>
        <Typography variant="h6" fontWeight={600}>
          No store selected
        </Typography>

        <Typography color="text.secondary" textAlign="center">
          Please select a store before accessing the cart.
        </Typography>

        <Button
          startIcon={<ArrowBackIcon />}
          variant="contained"
          sx={{ mt: 2, textTransform: "none" }}
          onClick={() => dispatch(setLeftView("LIST"))}>
          Back to Stores
        </Button>
      </Box>
    );
  }

  if (latitude === undefined || longitude === undefined) {
    return (
      <Box
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={2}
        p={4}>
        <Typography variant="h6" fontWeight={600}>
          Store location missing
        </Typography>

        <Typography color="text.secondary" textAlign="center">
          This store does not have a valid location configured.
        </Typography>

        <Button
          startIcon={<ArrowBackIcon />}
          variant="contained"
          sx={{ mt: 2, textTransform: "none" }}
          onClick={() => dispatch(setLeftView("LIST"))}>
          Back to Stores
        </Button>
      </Box>
    );
  }

  /* ---------------- EMPTY CART (NEW UI) ---------------- */

  if (!cartItems.length) {
    return (
      <Box
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={3}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <ShoppingCartOutlined sx={{ fontSize: 36, color: "#9ca3af" }} />
        </Box>

        <Box textAlign="center">
          <Typography variant="h6" fontWeight={600}>
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add products to start creating an order
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
          }}>
          Browse Products
        </Button>
      </Box>
    );
  }

  /* ---------------- CALCULATIONS ---------------- */

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const totalAmount = subtotal;

  /* ---------------- ORDER ---------------- */

  const handleCreateOrder = async () => {
    if (!cartItems.length) return;

    const finalPaidAmount =
      paymentMode === "CASH" ? Number(paidAmount || 0) : totalAmount;

    if (paymentMode === "CASH" && finalPaidAmount <= 0) {
      alert("Please enter paid amount");
      return;
    }

    if (finalPaidAmount > totalAmount) {
      alert("Paid amount cannot exceed total amount");
      return;
    }

    const storeAddress = selectedStore?.address || {};

    const payload = {
      consumerId,
      products: cartItems.map((item) => ({
        name: item.name,
        uom: item.uom,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        image: item.image,
      })),
      paidAmount: finalPaidAmount,
      paymentMode,
      latitude,
      longitude,
      deliveryAddress: {
        street: storeAddress.street || "",
        city: storeAddress.city || "",
        state: storeAddress.state || "",
        pincode: storeAddress.pincode || "",
      },
    };

    try {
      setLoading(true);
      await createOrder(payload);

      toast.success("Order created successfully");
      dispatch(clearCart(consumerId));
      dispatch(setLeftView("CREATE"));
    } catch (err) {
      console.error("Order creation failed", err);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <Box display="flex" height="100%">
      {/* LEFT: CART ITEMS */}
      <Box flex={1} p={4} overflow="auto">
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h4" fontWeight={700}>
            Shopping Cart
          </Typography>
          <Typography color="text.secondary">
            {cartItems.length} items
          </Typography>
        </Box>

        <Divider />

        {cartItems.map((item) => (
          <Box key={item.id} py={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                component="img"
                src={item.image}
                alt={item.name}
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 2,
                  objectFit: "cover",
                }}
              />

              <Box flex={1}>
                <Typography fontWeight={600}>{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{item.unitPrice} / {item.uom}
                </Typography>
              </Box>

              {/* QTY */}
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  size="small"
                  onClick={() => {
                    if (item.quantity > 1) {
                      dispatch(
                        addToCart({
                          consumerId,
                          product: { ...item, quantity: -1 },
                        }),
                      );
                    } else {
                      dispatch(
                        removeFromCart({
                          consumerId,
                          productId: item.id,
                        }),
                      );
                    }
                  }}>
                  <RemoveIcon fontSize="small" />
                </IconButton>

                <TextField
                  value={item.quantity}
                  size="small"
                  sx={{
                    width: 48,
                    "& input": {
                      textAlign: "center",
                      fontSize: 13,
                    },
                  }}
                />

                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      addToCart({
                        consumerId,
                        product: { ...item, quantity: 1 },
                      }),
                    )
                  }>
                  <AddIcon fontSize="small" />
                </IconButton>

                <Typography variant="caption" color="text.secondary">
                  {item.uom}
                </Typography>
              </Box>

              <Typography fontWeight={600} width={90} textAlign="right">
                ₹{item.unitPrice * item.quantity}
              </Typography>

              <IconButton
                onClick={() =>
                  dispatch(
                    removeFromCart({
                      consumerId,
                      productId: item.id,
                    }),
                  )
                }>
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider sx={{ mt: 3 }} />
          </Box>
        ))}

        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 3, textTransform: "none" }}
          onClick={onBack}>
          Back to shop
        </Button>
      </Box>

      {/* RIGHT: SUMMARY */}
      <Box
        width={360}
        p={4}
        sx={{
          backgroundColor: "#f3f4f6",
          borderLeft: "1px solid #e5e7eb",
        }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Summary
        </Typography>

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography>ITEMS {cartItems.length}</Typography>
          <Typography>₹{subtotal}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography fontWeight={700}>TOTAL PRICE</Typography>
          <Typography fontWeight={700}>₹{totalAmount}</Typography>
        </Box>

        <TextField
          select
          label="Payment Mode"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}>
          <MenuItem value="CASH">Cash</MenuItem>
          <MenuItem value="UPI">UPI</MenuItem>
          <MenuItem value="CARD">Card</MenuItem>
        </TextField>

        {paymentMode === "CASH" && (
          <TextField
            label="Amount Paid"
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{
            height: 52,
            backgroundColor: "#111827",
            fontWeight: 700,
          }}
          disabled={!cartItems.length || loading}
          onClick={handleCreateOrder}>
          {loading ? "Creating Order..." : "Create Order"}
        </Button>
      </Box>
    </Box>
  );
};

export default MyCart;

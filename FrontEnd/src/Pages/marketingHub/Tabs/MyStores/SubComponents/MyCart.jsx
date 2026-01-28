import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  removeFromCart,
} from "../../../../../redux/slices/addToCart/addToCart";

import { createOrder } from "../../../../../api/services";

const MyCart = ({ onBack, consumerId }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.addToCart.items);

  const [paymentMode, setPaymentMode] = useState("CASH");
  const [loading, setLoading] = useState(false);

  /* ---------------- CALCULATIONS ---------------- */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const gstAmount = 0; // keep 0 unless backend requires GST split
  const totalAmount = subtotal + gstAmount;

  /* ---------------- SUBMIT ---------------- */
  const handleCreateOrder = async () => {
    if (!cartItems.length) return;

    const payload = {
      consumerId,
      products: cartItems.map(({ name, quantity, unitPrice, image }) => ({
        name,
        quantity,
        unitPrice,
        image,
      })),
      paidAmount: totalAmount,
      paymentMode,
      latitude: 22.5958,
      longitude: 88.2636,
    };

    try {
      setLoading(true);
      await createOrder(payload);
      dispatch(clearCart());
      onBack(); // go back to product list
    } catch (err) {
      console.error("Order creation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2} height="100%" display="flex" flexDirection="column">
      {/* HEADER */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography fontWeight={600}>My Cart</Typography>
      </Box>

      <Divider />

      {/* CART ITEMS */}
      <Box flex={1} overflow="auto" mt={2}>
        {cartItems.map((item) => (
          <Box key={item.id} mb={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight={500}>{item.name}</Typography>
              <Typography fontWeight={600}>
                ₹{item.unitPrice * item.quantity}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
              ₹{item.unitPrice} × {item.quantity}
            </Typography>

            <Button
              size="small"
              color="error"
              onClick={() => dispatch(removeFromCart(item.id))}>
              Remove
            </Button>

            <Divider sx={{ mt: 1 }} />
          </Box>
        ))}

        {!cartItems.length && (
          <Typography color="text.secondary" mt={4} textAlign="center">
            Your cart is empty
          </Typography>
        )}
      </Box>

      {/* SUMMARY */}
      <Box mt={2}>
        <Divider />
        <Box mt={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography>Subtotal</Typography>
            <Typography fontWeight={600}>₹{subtotal}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography>Total</Typography>
            <Typography fontWeight={700}>₹{totalAmount}</Typography>
          </Box>
        </Box>

        {/* PAYMENT MODE */}
        <Box mt={2}>
          <Typography fontWeight={600} mb={1}>
            Payment Mode
          </Typography>

          <RadioGroup
            row
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}>
            <FormControlLabel value="CASH" control={<Radio />} label="Cash" />
            <FormControlLabel value="UPI" control={<Radio />} label="UPI" />
            <FormControlLabel value="CARD" control={<Radio />} label="Card" />
          </RadioGroup>
        </Box>

        {/* CTA */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          disabled={!cartItems.length || loading}
          onClick={handleCreateOrder}>
          {loading ? "Creating Order..." : "Create Order"}
        </Button>
      </Box>
    </Box>
  );
};

export default MyCart;

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";

const PaymentModal = ({
  open,
  onClose,
  order,
  paymentAmount,
  setPaymentAmount,
  onSubmit,
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Collect Payment</DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            Store: <b>{order?.deliveryAddress?.storeName}</b>
          </Typography>

          <Typography variant="body2">
            Owner: <b>{order?.deliveryAddress?.ownerName}</b>
          </Typography>

          <Typography variant="body2">
            Order ID: <b>{order?.orderId}</b>
          </Typography>

          <Typography variant="body2">
            Due Amount: <b>₹{order?.dueAmount}</b>
          </Typography>
        </Box>

        <TextField
          label="Payment Amount"
          type="number"
          fullWidth
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>

        <Button variant="contained" onClick={onSubmit}>
          Confirm Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;

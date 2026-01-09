import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Onboarding() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    aadhaar: "",
    pan: "",
    phoneNo: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Future backend integration point
   */
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // 🔁 Replace this block with real API call later
      // await api.submitOnboarding(form);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #fde68a 0%, #f59e0b 45%, #f59e0b 100%)",
        display: "flex",
        alignItems: "center",
        py: 6,
      }}>
      <Container maxWidth="sm">
        <Paper elevation={12} sx={{ p: 4, borderRadius: 3 }}>
          {/* CONDITIONAL RENDER */}
          {!isSubmitted ? (
            <>
              {/* HEADER */}
              <Typography variant="h5" fontWeight={700}>
                Onboarding
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.5, mb: 3 }}>
                Join Bengol Spices to explore authentic flavours
              </Typography>

              {/* BASIC DETAILS */}
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                Basic Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNo"
                    value={form.phoneNo}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Aadhaar Number"
                    name="aadhaar"
                    value={form.aadhaar}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="PAN Number"
                    name="pan"
                    value={form.pan}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>

              {/* ACTION */}
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  mt: 4,
                  py: 1.4,
                  fontWeight: 600,
                  textTransform: "none",
                  backgroundColor: "#f97316",
                  "&:hover": {
                    backgroundColor: "#ea580c",
                  },
                }}>
                {isSubmitting ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : (
                  "Save & Continue"
                )}
              </Button>
            </>
          ) : (
            /* SUCCESS STATE */
            <Box sx={{ textAlign: "center", py: 6 }}>
              <CheckCircleIcon
                sx={{
                  fontSize: 56,
                  color: "success.main",
                  mb: 2,
                }}
              />

              <Typography variant="h6" fontWeight={700} gutterBottom>
                Application Submitted
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  maxWidth: 420,
                  mx: "auto",
                  lineHeight: 1.6,
                }}>
                Your application has been successfully submitted and is
                currently under review. You will be notified via email once your
                application has been approved.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

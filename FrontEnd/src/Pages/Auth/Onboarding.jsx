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
import { agentRegistration } from "../../api/services";

export default function Onboarding() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    aadhaar: "",
    pan: "",
    photo: null,
    aadhaarFile: null,
    panFile: null,
  });

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || !files.length) return;
    setForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";

    if (!/^[6-9]\d{9}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";

    if (!form.photo) newErrors.photo = "Profile photo is required";
    if (!form.aadhaarFile) newErrors.aadhaarFile = "Aadhaar document required";
    if (!form.panFile) newErrors.panFile = "PAN document required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("address", form.address);

      // FILES — must match backend field names
      formData.append("aadhaar", form.aadhaarFile);
      formData.append("pan", form.panFile);
      formData.append("photo", form.photo);

      await agentRegistration(formData);

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

              <Grid container spacing={3}>
                {/* BASIC DETAILS */}
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                  />
                </Grid>

                {/* DOCUMENT UPLOADS */}
                <Grid item xs={12} sm={6} md={4}>
                  <Button fullWidth variant="outlined" component="label">
                    Upload Profile Photo
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      name="photo"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography variant="caption" color="error">
                    {errors.photo}
                  </Typography>
                  {form.photo && (
                    <Typography variant="caption" color="text.secondary">
                      {form.photo.name}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Button fullWidth variant="outlined" component="label">
                    Upload Aadhaar
                    <input
                      hidden
                      type="file"
                      accept="application/pdf,image/*"
                      name="aadhaarFile"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography variant="caption" color="error">
                    {errors.aadhaarFile}
                  </Typography>
                  {form.aadhaarFile && (
                    <Typography variant="caption" color="text.secondary">
                      {form.aadhaarFile.name}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Button fullWidth variant="outlined" component="label">
                    Upload PAN
                    <input
                      hidden
                      type="file"
                      accept="application/pdf,image/*"
                      name="panFile"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography variant="caption" color="error">
                    {errors.panFile}
                  </Typography>
                  {form.panFile && (
                    <Typography variant="caption" color="text.secondary">
                      {form.panFile.name}
                    </Typography>
                  )}
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
                  "APPLY"
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

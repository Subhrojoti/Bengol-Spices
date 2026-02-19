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
  Stack,
  MenuItem,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { deliveryPartnerRegister } from "../../../api/services";

export default function DeliveryPartnerRegister() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    idType: "AADHAAR",
    idNumber: "",
    document: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (!e.target.files?.length) return;
    setForm((prev) => ({ ...prev, document: e.target.files[0] }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!/^[6-9]\d{9}$/.test(form.phone))
      newErrors.phone = "Enter valid 10-digit phone";

    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!form.idNumber.trim()) newErrors.idNumber = "ID Number required";

    if (!form.document) newErrors.document = "Document is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("password", form.password);
      formData.append("idType", form.idType);
      formData.append("idNumber", form.idNumber);
      formData.append("document", form.document);

      await deliveryPartnerRegister(formData);

      setIsSubmitted(true);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = {
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0f766e",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "rgba(0,0,0,0.42)", // default gray
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottomColor: "#0f766e",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#0f766e",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #a5f3fc 0%, #06b6d4 40%, #0f766e 100%)",
        display: "flex",
        alignItems: "center",
        py: 6,
      }}>
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 3 }}>
          {!isSubmitted ? (
            <>
              <Typography variant="h5" fontWeight={700}>
                Delivery Partner Registration
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 1, mb: 3 }}>
                Register to start delivering with us
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={inputStyles}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    sx={inputStyles}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={inputStyles}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    variant="standard"
                    label="ID Type"
                    name="idType"
                    value={form.idType}
                    onChange={handleChange}
                    sx={inputStyles}>
                    <MenuItem value="AADHAAR">AADHAAR</MenuItem>
                    <MenuItem value="PAN">PAN</MenuItem>
                    <MenuItem value="DL">Driving License</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="ID Number"
                    name="idNumber"
                    value={form.idNumber}
                    onChange={handleChange}
                    error={!!errors.idNumber}
                    helperText={errors.idNumber}
                    sx={inputStyles}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadIcon />}
                      sx={{
                        color: "#0f766e",
                        borderColor: "#0f766e",
                        "&:hover": {
                          borderColor: "#0d5f57",
                          backgroundColor: "rgba(15,118,110,0.08)",
                        },
                      }}>
                      Upload Document
                      <input
                        hidden
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={handleFileChange}
                      />
                    </Button>

                    {errors.document && (
                      <Typography variant="caption" color="error">
                        {errors.document}
                      </Typography>
                    )}

                    {form.document && (
                      <Typography variant="caption">
                        {form.document.name}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  mt: 4,
                  py: 1.3,
                  fontWeight: 600,
                  textTransform: "none",
                  backgroundColor: "#0f766e",
                  "&:hover": {
                    backgroundColor: "#115e59",
                  },
                }}>
                {isSubmitting ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : (
                  "REGISTER"
                )}
              </Button>
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <CheckCircleIcon
                sx={{ fontSize: 56, color: "success.main", mb: 2 }}
              />
              <Typography variant="h6" fontWeight={700}>
                Registration Successful
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Your application has been submitted successfully.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

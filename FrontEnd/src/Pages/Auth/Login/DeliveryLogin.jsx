import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  MobileStepper,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { deliveryLogin } from "../../../api/services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const deliveryImages = [
  {
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80",
    title: "Fast & Reliable Delivery",
    desc: "Delivering freshness straight to customers’ doors.",
  },
  {
    img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1400&q=80",
    title: "Track Every Order",
    desc: "Smart logistics powered by technology.",
  },
  {
    img: "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1400&q=80",
    title: "On-Time Guarantee",
    desc: "Efficiency that keeps customers happy.",
  },
];

export default function DeliveryLogin() {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({ phone: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % deliveryImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { phone, password } = form;

    if (!phone || !password) {
      toast.error("Phone and password are required");
      return;
    }

    try {
      const data = await deliveryLogin(phone, password);

      if (data.success) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("role", "DELIVERY_PARTNER");

        navigate("/delivery/dashboard", { replace: true });
      } else {
        toast.error("Invalid phone or password");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #a5f3fc 0%, #06b6d4 40%, #0f766e 100%)",
        display: "flex",
        alignItems: "center",
      }}>
      <Container maxWidth="md">
        <Box sx={{ position: "relative", height: 540 }}>
          {/* LEFT SLIDER */}
          <Paper
            elevation={10}
            sx={{
              width: "80%",
              height: "100%",
              borderRadius: 2,
              overflow: "hidden",
              position: "relative",
              display: { xs: "none", md: "block" },
            }}>
            {deliveryImages.map((item, index) => (
              <Box
                key={index}
                sx={{
                  position: "absolute",
                  inset: 0,
                  opacity: activeStep === index ? 1 : 0,
                  transition: "opacity 0.8s ease",
                }}>
                <Box
                  component="img"
                  src={item.img}
                  alt={item.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.45)",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 40,
                    left: 40,
                    right: 40,
                    color: "#fff",
                  }}>
                  <Typography variant="h5" fontWeight={700}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            ))}

            <MobileStepper
              variant="dots"
              steps={deliveryImages.length}
              position="static"
              activeStep={activeStep}
              sx={{
                position: "absolute",
                bottom: 12,
                left: 32,
                background: "transparent",
              }}
              nextButton={null}
              backButton={null}
            />
          </Paper>

          {/* LOGIN CARD */}
          <Paper
            elevation={14}
            sx={{
              width: 400,
              p: 4,
              borderRadius: 2,
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "#fff",
            }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Delivery Partner Login
            </Typography>

            <Typography variant="body2" sx={{ color: "#0a4540", mb: 3 }}>
              Sign in to access your delivery dashboard
            </Typography>

            <TextField
              fullWidth
              variant="standard"
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              margin="normal"
              sx={{
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#0f766e",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#0f766e",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "#0f766e",
                },
              }}
            />

            <TextField
              fullWidth
              variant="standard"
              type="password"
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              sx={{
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#0f766e",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#0f766e",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "#0f766e",
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              sx={{
                mt: 4,
                py: 1.3,
                backgroundColor: "#0f766e",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#115e59",
                },
              }}>
              Login
            </Button>
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, color: "black" }}>
              Not a delivery partner yet?{" "}
              <Link
                component={RouterLink}
                to="/delivery-partner-register"
                underline="hover"
                sx={{ fontWeight: 600, color: "#0f766e" }}>
                Apply Now
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  MobileStepper,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

const spiceImages = [
  {
    img: "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&w=1400&q=80",
    title: "Bengol Spices",
    desc: "Authentic spices sourced with tradition and purity.",
  },
  {
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1400&q=80",
    title: "Rich Flavours",
    desc: "Bold aromas and vibrant blends for everyday cooking.",
  },
  {
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
    title: "Premium Quality",
    desc: "Carefully selected ingredients for modern kitchens.",
  },
];

export default function Login() {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({ agentId: "", password: "" });

  // Auto-slide (React 19 safe)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % spiceImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #fde68a 0%, #f59e0b 45%, #f59e0b 100%)",
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
            {spiceImages.map((item, index) => (
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

                {/* Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.45)",
                  }}
                />

                {/* Text */}
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

            {/* DOTS */}
            <MobileStepper
              variant="dots"
              steps={spiceImages.length}
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

          {/* OVERLAPPING LOGIN CARD */}
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
              Agent Login
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
              Sign in to manage your Bengol Spices account
            </Typography>

            <TextField
              fullWidth
              variant="standard"
              label="Agent-ID"
              name="agentId"
              value={form.agentId}
              onChange={handleChange}
              margin="normal"
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
            />

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                py: 1.3,
                backgroundColor: "#b45309",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#92400e",
                },
              }}>
              Login
            </Button>

            {/* SIGN UP LINK */}
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, color: "text.secondary" }}>
              Don&apos;t have an account?{" "}
              <Link
                component={RouterLink}
                to="/onboarding"
                underline="hover"
                sx={{ fontWeight: 600 }}>
                Sign up
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

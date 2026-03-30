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
import { useNavigate } from "react-router-dom";
import { agentLogin } from "../../../api/services";
import { Link } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import slide1 from "../../../assets/Slides/Slide1.png";
import slide2 from "../../../assets/Slides/Slide2.png";
import slide3 from "../../../assets/Slides/Slide3.png";

const spiceImages = [
  {
    img: slide1,
    title: "Bengol Spices",
    desc: "Authentic spices sourced with tradition and purity.",
  },
  {
    img: slide2,
    title: "Rich Flavours",
    desc: "Bold aromas and vibrant blends for everyday cooking.",
  },
  {
    img: slide3,
    title: "Premium Quality",
    desc: "Carefully selected ingredients for modern kitchens.",
  },
];

export default function Login() {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({ agentId: "", password: "" });
  const navigate = useNavigate();

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

  const handleLogin = async () => {
    const { agentId, password } = form;

    try {
      const data = await agentLogin(agentId, password);

      if (data.success) {
        localStorage.setItem("agentToken", data.token);
        localStorage.setItem("role", "AGENT");

        navigate("/marketing", { replace: true });
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid agent-id or password");
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
              onClick={handleLogin}
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

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, color: "text.secondary" }}>
              Not an agent yet?{" "}
              <Link
                component={RouterLink}
                to="/agent-onboarding"
                underline="hover"
                sx={{ fontWeight: 600 }}>
                Apply Now
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import { getTargetPerformance } from "../../../../../api/services";

export default function TargetPerformance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const res = await getTargetPerformance();
      setData(res?.data || []);
    } catch (err) {
      console.error("Error fetching performance:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  // ================= EMPTY STATE =================
  if (!data.length) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}>
        <Box
          sx={{
            bgcolor: "#cefffc",
            color: "#0071bd",
            p: 2,
            borderRadius: "50%",
            mb: 2,
          }}>
          <BarChartIcon sx={{ fontSize: 32 }} />
        </Box>

        <Typography variant="h6" fontWeight={600} gutterBottom>
          No Performance Data Yet
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 360 }}>
          Target performance analytics will appear here once targets are created
          and agents start completing their daily targets.
        </Typography>
      </Box>
    );
  }

  // ================= DATA UI =================
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Target Performance
      </Typography>

      <Grid container spacing={2}>
        {data.map((agent, index) => {
          const progress = (agent.completedTarget / agent.totalTarget) * 100;

          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: "0.2s",
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}>
                <CardContent>
                  {/* Agent Name */}
                  <Typography fontWeight={600} mb={1}>
                    {agent.agentName || "Agent"}
                  </Typography>

                  {/* Targets */}
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {agent.completedTarget} / {agent.totalTarget} completed
                  </Typography>

                  {/* Progress Bar */}
                  <LinearProgress
                    variant="determinate"
                    value={progress || 0}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      mb: 1,
                    }}
                  />

                  {/* Percentage */}
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(progress || 0)}% achieved
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

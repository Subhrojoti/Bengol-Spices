import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { toast } from "react-toastify";
import { getDailyTarget } from "../../../../api/services";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

const Targets = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTarget = async () => {
    try {
      const res = await getDailyTarget();
      if (res?.success) {
        setData(res);
      } else {
        toast.error("Failed to fetch target");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarget();
  }, []);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-[60vh]">
        <Typography variant="h6">Loading target...</Typography>
      </Box>
    );
  }

  if (!data || !data.target) {
    return (
      <Box className="flex flex-col justify-center items-center h-[60vh] text-center">
        <TrackChangesIcon sx={{ fontSize: 60, color: "#9ca3af" }} />
        <Typography variant="h6" className="mt-4 text-gray-500">
          No target assigned for today
        </Typography>
      </Box>
    );
  }

  const { target, progress } = data;
  const percentage = Math.min((progress / target.requiredCount) * 100, 100);
  const isCompleted = progress >= target.requiredCount;

  const chartData = [
    {
      name: "progress",
      value: percentage,
      fill: isCompleted ? "#22c55e" : "#6366f1",
    },
  ];

  return (
    <Box className="p-4 md:p-6 text-center">
      {/* Header */}
      <Typography variant="h5" className="font-semibold">
        Today’s Target
      </Typography>
      <Box className="flex justify-center mt-10">
        <Card className="rounded-2xl shadow-lg w-full max-w-3xl px-6 py-5">
          <CardContent>
            {/* Top Section */}
            <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
              {/* LEFT: Info */}
              <Box className="space-y-2">
                <Typography variant="h6" className="font-semibold">
                  {target.name}
                </Typography>

                <Box className="flex items-center gap-2">
                  <EmojiEventsIcon className="text-yellow-500" />
                  <Typography className="font-medium">
                    ₹{target.incentiveAmount} Incentive
                  </Typography>
                </Box>
              </Box>

              {/* RIGHT: Radial Chart */}
              <Box className="w-full md:w-[220px] h-[220px] relative">
                <ResponsiveContainer>
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={chartData}
                    startAngle={90}
                    endAngle={-270}>
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      tick={false}
                    />
                    <RadialBar background dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <Box className="absolute inset-0 flex flex-col items-center justify-center">
                  <Typography variant="h5" className="font-bold">
                    {percentage.toFixed(0)}%
                  </Typography>
                  <Typography className="text-xs text-gray-500">
                    Completed
                  </Typography>
                </Box>
              </Box>
              <Box className="space-y-2 flex flex-col items-center">
                <Typography className="text-gray-600 text-sm">
                  {progress} of {target.requiredCount} completed
                </Typography>
                {isCompleted ? (
                  <Chip label="Completed" color="success" />
                ) : (
                  <Chip label="In Progress" color="primary" />
                )}
              </Box>
            </Box>

            {/* Bottom Section (Motivation / Status) */}
            <Box className="mt-6 p-4 rounded-xl bg-gray-50 flex flex-col items-center">
              <Typography className="text-sm text-gray-600">
                {isCompleted
                  ? "Great job! You've achieved today's target 🎉"
                  : `Complete ${
                      target.requiredCount - progress
                    } more to earn ₹${target.incentiveAmount}`}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Targets;

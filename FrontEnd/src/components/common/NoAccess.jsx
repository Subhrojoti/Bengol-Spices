import { Box, Typography } from "@mui/material";

const NoAccess = () => {
  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
      }}>
      <Typography variant="h5" fontWeight={600}>
        You currently have no access for this page
      </Typography>

      <Typography variant="body1" mt={1}>
        Please connect with Admin for requesting access.
      </Typography>
    </Box>
  );
};

export default NoAccess;

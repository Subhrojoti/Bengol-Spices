import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const StoresList = ({
  stores,
  selectedStore,
  onSelectStore,
  onCreateOrder,
  onCreate,
  onViewOrders,
}) => {
  return (
    <Box p={2}>
      <Grid container spacing={3}>
        {stores.map((store) => (
          <Grid item xs={12} sm={6} md={4} key={store._id}>
            <Card
              onClick={() => onSelectStore(store)}
              sx={{
                height: 250,
                width: 250,
                cursor: "pointer",
                borderRadius: 3,
                border:
                  selectedStore?._id === store._id
                    ? "2px solid #f59e0b"
                    : "1px solid transparent",
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <StorefrontIcon sx={{ color: "#d97706" }} />
                  <Typography fontWeight={600} noWrap>
                    {store.storeName}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Owner: <strong>{store.ownerName}</strong>
                </Typography>

                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <PhoneIcon fontSize="small" />
                  <Typography variant="body2">{store.phone}</Typography>
                </Box>

                <Box display="flex" gap={1} mt={1}>
                  <LocationOnIcon fontSize="small" />
                  <Typography
                    variant="body2"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                    {store.address}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Chip
                    label={store.storeType}
                    size="small"
                    sx={{
                      backgroundColor:
                        store.storeType === "WHOLESALER"
                          ? "#ddd6fe"
                          : "#cffafe",
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={store.status}
                    size="small"
                    sx={{
                      backgroundColor:
                        store.status === "ACTIVE" ? "#bbf7d0" : "#e2e8f0",
                      fontWeight: 600,
                    }}
                  />
                </Box>
                {/* ACTION BUTTONS */}
                <Box display="flex" gap={1.5} mt={2}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    startIcon={<ReceiptLongIcon sx={{ fontSize: 14 }} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewOrders(store);
                    }}
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: 600,
                      fontSize: 11.5,

                      lineHeight: 1,

                      paddingY: 1,
                      minHeight: 26,
                      "& .MuiButton-startIcon": {
                        marginRight: 0.5,
                      },
                    }}>
                    View Orders
                  </Button>

                  <Button
                    fullWidth
                    size="small"
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon sx={{ fontSize: 14 }} />}
                    onClick={onCreateOrder}
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: 600,
                      fontSize: 11.5,

                      lineHeight: 1,

                      paddingY: 1,
                      minHeight: 26,
                      backgroundColor: "#f59e0b",
                      "&:hover": {
                        backgroundColor: "#b45309",
                      },
                      "& .MuiButton-startIcon": {
                        marginRight: 0.5,
                      },
                    }}>
                    Create Order
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StoresList;

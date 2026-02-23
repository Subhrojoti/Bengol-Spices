import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Tooltip,
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
                height: 360,
                width: 260,
                cursor: "pointer",
                borderRadius: 3,
                overflow: "hidden",
                border:
                  selectedStore?._id === store._id
                    ? "2px solid #f59e0b"
                    : "1px solid #eee",
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}>
              {/* IMAGE SECTION */}
              <Box
                sx={{
                  height: 150,
                  backgroundColor: "#dcdcdc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                {store.image?.url ? (
                  <Box
                    component="img"
                    src={store.image.url}
                    alt={store.storeName}
                    sx={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <StorefrontIcon sx={{ fontSize: 50, color: "#858585" }} />
                )}
              </Box>

              <CardContent sx={{ p: 2 }}>
                <Typography fontWeight={600} noWrap>
                  {store.storeName}
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  Owner: <strong>{store.ownerName}</strong>
                </Typography>

                {/* Phone */}
                <Box display="flex" alignItems="center" gap={1}>
                  <PhoneIcon fontSize="small" />
                  <Typography variant="body2">{store.phone}</Typography>
                </Box>

                {/* Address */}
                <Tooltip
                  title={
                    store.address
                      ? `${store.address.street}, ${store.address.city}, ${store.address.state} - ${store.address.pincode}`
                      : ""
                  }>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ mt: 0.5 }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 180,
                      }}>
                      {store.address
                        ? `${store.address.street}, ${store.address.city}`
                        : ""}
                    </Typography>
                  </Box>
                </Tooltip>

                {/* Chips */}
                <Box display="flex" justifyContent="space-between" mt={1}>
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
                <Box display="flex" gap={1} mt={1}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    startIcon={<ReceiptLongIcon sx={{ fontSize: 14 }} />}
                    onClick={(e) => {
                      e.stopPropagation();

                      // 🔥 FIX: Select store first
                      onSelectStore(store);

                      // Then trigger action
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
                    onClick={(e) => {
                      e.stopPropagation();

                      // 🔥 FIX: Select store first
                      onSelectStore(store);

                      // Then trigger action
                      onCreateOrder(store);
                    }}
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

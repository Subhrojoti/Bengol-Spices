import {
  Box,
  Card,
  CardContent,
  Typography,
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
    <Box
      sx={{
        px: { xs: 1, sm: 2 },
        py: 2,
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(5, 1fr)",
        },
        gap: { xs: 1.5, sm: 3 },
      }}>
      {stores.map((store) => (
        <Card
          key={store._id}
          onClick={() => onSelectStore(store)}
          sx={{
            width: "100%",
            maxWidth: { sm: 260 },
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
              height: { xs: 110, sm: 150 },
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
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <StorefrontIcon
                sx={{ fontSize: { xs: 36, sm: 50 }, color: "#858585" }}
              />
            )}
          </Box>

          <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Store Name */}
            <Typography
              fontWeight={600}
              noWrap
              sx={{ fontSize: { xs: 13, sm: 15 } }}>
              {store.storeName}
            </Typography>

            {/* Owner */}
            <Typography
              variant="body2"
              color="text.secondary"
              mb={0.5}
              noWrap
              sx={{ fontSize: { xs: 11, sm: 13 } }}>
              <strong>{store.ownerName}</strong>
            </Typography>

            {/* Phone */}
            <Box display="flex" alignItems="center" gap={0.5}>
              <PhoneIcon sx={{ fontSize: { xs: 12, sm: 16 }, flexShrink: 0 }} />
              <Typography
                variant="body2"
                noWrap
                sx={{ fontSize: { xs: 11, sm: 13 }, minWidth: 0 }}>
                {store.phone}
              </Typography>
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
                gap={0.5}
                sx={{ mt: 0.5, minWidth: 0 }}>
                <LocationOnIcon
                  sx={{ fontSize: { xs: 12, sm: 16 }, flexShrink: 0 }}
                />
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontSize: { xs: 11, sm: 13 },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: 0,
                  }}>
                  {store.address
                    ? `${store.address.street}, ${store.address.city}`
                    : ""}
                </Typography>
              </Box>
            </Tooltip>

            {/* Chips */}
            <Box
              display="flex"
              justifyContent="space-between"
              mt={1}
              gap={0.5}
              flexWrap="wrap">
              <Chip
                label={store.storeType}
                size="small"
                sx={{
                  backgroundColor:
                    store.storeType === "WHOLESALER" ? "#ddd6fe" : "#cffafe",
                  fontWeight: 600,
                  fontSize: { xs: 9, sm: 11 },
                  height: { xs: 18, sm: 24 },
                }}
              />
              <Chip
                label={store.status}
                size="small"
                sx={{
                  backgroundColor:
                    store.status === "ACTIVE" ? "#bbf7d0" : "#e2e8f0",
                  fontWeight: 600,
                  fontSize: { xs: 9, sm: 11 },
                  height: { xs: 18, sm: 24 },
                }}
              />
            </Box>

            {/* ACTION BUTTONS */}
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
      ))}
    </Box>
  );
};

export default StoresList;

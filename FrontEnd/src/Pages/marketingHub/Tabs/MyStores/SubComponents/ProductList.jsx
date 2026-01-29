import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Badge,
} from "@mui/material";

import { ShoppingCartOutlined } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { fetchProducts } from "../../../../../api/services";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../../../redux/slices/addToCart/addToCart";
import { setLeftView } from "../../../../../redux/slices/myStoresUi/myStoresUi";

const ProductList = ({ onBack }) => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [imageIndex, setImageIndex] = useState({});
  const selectedStore = useSelector((state) => state.myStoresUi.selectedStore);
  const dispatch = useDispatch();
  const consumerId = selectedStore?.consumerId;
  const cartCount = useSelector((state) =>
    consumerId ? state.addToCart.carts[consumerId]?.items.length || 0 : 0,
  );
  const storeName = selectedStore?.storeName;

  const FallBackImage =
    "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2";

  /* ---------------- IMAGE SLIDER ---------------- */
  const handleImageChange = (id, direction, max) => {
    setImageIndex((prev) => {
      const current = prev[id] || 0;
      const next =
        direction === "next" ? (current + 1) % max : (current - 1 + max) % max;

      return { ...prev, [id]: next };
    });
  };

  /* ---------------- API ---------------- */
  useEffect(() => {
    const loadProducts = async () => {
      const res = await fetchProducts();
      setProducts(res?.products || []);
    };
    loadProducts();
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAddToCart = (product) => {
    if (!consumerId) return;

    dispatch(
      addToCart({
        consumerId,
        product: {
          id: product._id,
          name: product.name,
          uom: product.uom,
          unitPrice: product.discountPrice ?? product.price,
          quantity: Number(quantities[product._id]),
          image: product.images?.front?.url,
        },
      }),
    );

    setCartItems((prev) => ({
      ...prev,
      [product._id]: true,
    }));
  };

  /* ---------------- UI ---------------- */
  return (
    <Box p={2}>
      {/* HEADER */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}>
        {/* LEFT: BACK + STORE NAME */}
        <Box display="flex" alignItems="center" gap={1.5}>
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>

          <Box>
            <Typography fontWeight={700} fontSize={16} lineHeight={1.2}>
              {storeName || "Selected Store"}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Ordering products for this store
            </Typography>
          </Box>
        </Box>

        {/* RIGHT: CART */}
        <IconButton size="small" onClick={() => dispatch(setLeftView("CART"))}>
          <Badge
            badgeContent={cartCount}
            color="warning"
            invisible={cartCount === 0}>
            <ShoppingCartOutlined />
          </Badge>
        </IconButton>
      </Box>

      {/* PRODUCTS GRID */}
      <Grid container spacing={3} sx={{ paddingLeft: 3.5 }}>
        {products.map((product) => {
          const qty = Number(quantities[product._id] || 0);
          const unitPrice = product.discountPrice ?? product.price;
          const totalPrice = qty * unitPrice;
          const isAdded = !!cartItems[product._id];

          const images = [
            product.images?.front?.url,
            product.images?.back?.url,
          ].filter(Boolean);

          const activeImage = imageIndex[product._id] || 0;

          return (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card
                sx={{
                  width: 280,
                  height: 420,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                }}>
                {/* IMAGE SLIDER (CARD WIDTH FIXED) */}
                <Box
                  position="relative"
                  sx={{
                    height: 220,
                    width: "100%",
                    backgroundColor: "#000",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}>
                  <Box
                    component="img"
                    src={images[activeImage] || FallBackImage}
                    alt={product.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  {images.length > 1 && (
                    <>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleImageChange(product._id, "prev", images.length)
                        }
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: 8,
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(0,0,0,0.5)",
                          color: "#fff",
                        }}>
                        <ChevronLeftIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() =>
                          handleImageChange(product._id, "next", images.length)
                        }
                        sx={{
                          position: "absolute",
                          top: "50%",
                          right: 8,
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(0,0,0,0.5)",
                          color: "#fff",
                        }}>
                        <ChevronRightIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>

                <CardContent sx={{ p: 2.25 }}>
                  {/* NAME + PRICE */}
                  <Box mb={1.5}>
                    <Typography fontWeight={600}>{product.name}</Typography>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={0.25}>
                      {/* LEFT: SELLING PRICE */}
                      <Typography variant="body2" color="text.secondary">
                        ₹{unitPrice} / {product.uom}
                      </Typography>

                      <Box display="flex" gap={0.5}>
                        {/* RIGHT: ORIGINAL PRICE */}
                        {product.discountPrice && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textDecoration: "line-through" }}>
                            ₹{product.price}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          GST: {product.gstPercentage}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* TOTAL + QTY */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    mb={1}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Total
                      </Typography>
                      <Typography fontWeight={700}>₹{totalPrice}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <TextField
                        type="number"
                        size="small"
                        value={quantities[product._id] || ""}
                        onChange={(e) =>
                          handleQuantityChange(product._id, e.target.value)
                        }
                        placeholder="Qty"
                        inputProps={{ min: 0 }}
                        sx={{
                          width: 76,
                          "& input": {
                            textAlign: "center",
                            fontSize: 13,
                          },
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {product.uom}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                {/* ADD TO CART */}
                <Box sx={{ mt: "auto" }}>
                  <Button
                    fullWidth
                    onClick={() => {
                      if (qty <= 0 || isAdded) return;
                      handleAddToCart(product);
                    }}
                    sx={{
                      height: 56,
                      borderRadius: "0 0 12px 12px",
                      fontSize: 16,
                      fontWeight: 700,
                      textTransform: "none",
                      color: "#ffffff",

                      /* ---------------- STATE COLORS ---------------- */
                      backgroundColor: isAdded
                        ? "#16a34a" // ✅ green (added)
                        : qty > 0
                          ? "#f59e0b" // ✅ orange (ready)
                          : "#e5e7eb", // ✅ light grey (initial)

                      cursor: qty <= 0 || isAdded ? "not-allowed" : "pointer",

                      /* ---------------- HOVER ---------------- */
                      "&:hover": {
                        backgroundColor: isAdded
                          ? "#16a34a"
                          : qty > 0
                            ? "#d97706"
                            : "#e5e7eb",
                      },

                      /* ---------------- TEXT COLOR FOR GREY STATE ---------------- */
                      ...(qty <= 0 &&
                        !isAdded && {
                          color: "#6b7280", // softer text on grey
                        }),
                    }}>
                    {isAdded ? "Added to Cart" : "Add to cart"}
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ProductList;

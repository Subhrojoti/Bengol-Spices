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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { fetchProducts } from "../../../../../api/services";

const CreateOrder = ({ onBack, onOpenCart }) => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [imageIndex, setImageIndex] = useState({});

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

  const handleAddToCart = (id) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const cartCount = Object.keys(cartItems).length;

  /* ---------------- UI ---------------- */
  return (
    <Box p={2}>
      {/* HEADER */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <IconButton onClick={onOpenCart}>
          <Badge
            badgeContent={cartCount}
            color="warning"
            invisible={cartCount === 0}>
            <AddShoppingCartIcon />
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
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                }}>
                {/* IMAGE SLIDER (CARD WIDTH FIXED) */}
                <Box
                  position="relative"
                  height={200}
                  width={250}
                  sx={{
                    backgroundColor: "#e6e3e3",
                    borderBottom: "1px solid #e5e7eb",
                    overflow: "hidden",
                  }}>
                  <Box
                    component="img"
                    src={images[activeImage] || FallBackImage}
                    alt={product.name}
                    sx={{
                      height: "100%",
                      width: "100%",
                      objectFit: "contain",
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
                          backgroundColor: "rgba(255,255,255,0.85)",
                        }}>
                        <ChevronLeftIcon />
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
                          backgroundColor: "rgba(255,255,255,0.85)",
                        }}>
                        <ChevronRightIcon />
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
                    mb={2}>
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

                  {/* ADD TO CART */}
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={qty <= 0 || isAdded}
                    onClick={() => handleAddToCart(product._id)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      backgroundColor: isAdded ? "#22c55e" : "#f59e0b",
                      "&:hover": {
                        backgroundColor: isAdded ? "#22c55e" : "#b45309",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "#22c55e",
                        color: "#fff",
                        opacity: 1,
                      },
                    }}>
                    {isAdded ? "Added to Cart" : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CreateOrder;

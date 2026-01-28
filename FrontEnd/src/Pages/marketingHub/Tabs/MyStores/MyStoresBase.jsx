import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { myStores } from "../../../../api/services";
import OrderDetails from "./SubComponents/OrderDetails";
import StoresList from "./SubComponents/StoresList";
import CreateOrder from "./SubComponents/CreateOrder";
import MyCart from "./SubComponents/MyCart";

const LEFT_VIEW = {
  LIST: "LIST",
  CREATE: "CREATE",
  CART: "CART",
};

const MyStoresBase = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [leftView, setLeftView] = useState(LEFT_VIEW.LIST);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await myStores();
        setStores(response?.stores || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stores.length) {
    return (
      <Typography textAlign="center" mt={6}>
        No stores found.
      </Typography>
    );
  }

  return (
    <Box display="flex" height="90vh" overflow="hidden">
      {/* LEFT PANEL (SCROLLABLE) */}
      <Box
        flex={1}
        overflow="auto"
        sx={{
          borderRight: "1px solid #e5e7eb",
        }}>
        {leftView === LEFT_VIEW.LIST && (
          <StoresList
            stores={stores}
            selectedStore={selectedStore}
            onSelectStore={setSelectedStore}
            onCreate={() => setLeftView(LEFT_VIEW.CREATE)}
          />
        )}

        {leftView === LEFT_VIEW.CREATE && (
          <CreateOrder
            onBack={() => setLeftView(LEFT_VIEW.LIST)}
            onOpenCart={() => setLeftView(LEFT_VIEW.CART)}
          />
        )}

        {leftView === LEFT_VIEW.CART && (
          <MyCart
            onBack={() => setLeftView(LEFT_VIEW.CREATE)}
            consumerId={selectedStore?.consumerId}
          />
        )}
      </Box>
    </Box>
  );
};

export default MyStoresBase;

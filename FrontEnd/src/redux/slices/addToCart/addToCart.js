import { createSlice } from "@reduxjs/toolkit";

const addToCartSlice = createSlice({
  name: "cart",
  initialState: {
    carts: {}, // 🔑 key = consumerId
  },
  reducers: {
    addToCart: (state, action) => {
      const { consumerId, product } = action.payload;

      // Initialize cart for store if not exists
      if (!state.carts[consumerId]) {
        state.carts[consumerId] = { items: [] };
      }

      state.carts[consumerId].items.push(product);
    },

    removeFromCart: (state, action) => {
      const { consumerId, productId } = action.payload;

      if (!state.carts[consumerId]) return;

      state.carts[consumerId].items = state.carts[consumerId].items.filter(
        (item) => item.id !== productId,
      );
    },

    clearCart: (state, action) => {
      const consumerId = action.payload;

      if (state.carts[consumerId]) {
        state.carts[consumerId].items = [];
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = addToCartSlice.actions;

export default addToCartSlice.reducer;

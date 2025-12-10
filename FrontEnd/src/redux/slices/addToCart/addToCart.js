import { createSlice } from "@reduxjs/toolkit";

const addToCartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // array of products
  },
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
      // payload = product object
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // payload = product id
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = addToCartSlice.actions;

export default addToCartSlice.reducer;

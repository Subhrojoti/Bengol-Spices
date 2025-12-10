import { configureStore } from "@reduxjs/toolkit";
import addToCartSlice from "./slices/addToCart/addToCart";

export const store = configureStore({
  reducer: {
    addToCart: addToCartSlice,
  },
});

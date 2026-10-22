import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: 0,
  },
  reducers: {
    cart: (state, action) => {
      return {
        ...state,
        cart: action.payload,
      };
    },

    
  },
});

export const { cart } = cartSlice.actions;

export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    details: "",
    rememberMe:""
  },
  reducers: {
    login: (state, action) => {
      return {
        ...state,
        details: action.payload,
      };
    },
    rememberAuth: (state, action) => {
      return {
        ...state,
        rememberMe: action.payload,
      };
    },
  },
});

export const { login , rememberAuth} = authSlice.actions;

export default authSlice.reducer;

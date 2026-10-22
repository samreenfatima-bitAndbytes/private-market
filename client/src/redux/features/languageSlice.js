// languageSlice.js
import { createSlice } from "@reduxjs/toolkit";
const languageSlice = createSlice({
  name: "language",
  initialState: {
    selectedLanguage: "English",
    imageSource: "/britin.png", // Default image source for English
  },
  reducers: {
    setLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
      state.imageSource = action.payload === "English" ? "/britin.png" : "/portugueseFlag.png";
    },
  },
});
export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;


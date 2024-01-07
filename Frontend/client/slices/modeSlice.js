import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "user"
};
//mode will be true if user selects driver option
const modalSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    setMode: (state,action) => {
      state.mode = action.payload
    },
  },
});

export const { setMode } = modalSlice.actions;
export default modalSlice.reducer;

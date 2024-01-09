import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "user",
  rideMode:""
};
//mode will be true if user selects driver option
const modalSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    setMode: (state,action) => {
      state.mode = action.payload
    },
    setRideMode: (state,action) => {
      state.rideMode =  action.payload
    }
  },
});

export const { setMode,setRideMode } = modalSlice.actions;
export default modalSlice.reducer;

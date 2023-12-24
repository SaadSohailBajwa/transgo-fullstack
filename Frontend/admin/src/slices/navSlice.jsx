import { createSlice } from "@reduxjs/toolkit";

// rest of your code...

const initialState = {
  route: 0,
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setRoute: (state, action) => {
      state.route = action.payload;
    },
  },
});

export const { setRoute } = navSlice.actions;

export default navSlice.reducer;

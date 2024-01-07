import { configureStore } from "@reduxjs/toolkit";
import phoneNumberReducer from "./slices/phoneNumberSlice";
import jwtSliceReducer from "./slices/jwtSlice";
import modeSliceReducer from "./slices/modeSlice";
import userLocationSliceReducer from "./slices/locationSlice";
import modalSliceReducer from "./slices/modalSlice";
import dataSlice from "./slices/dataSlice";

const store = configureStore({
  reducer: {
    phoneNumber: phoneNumberReducer,
    token: jwtSliceReducer,
    mode:modeSliceReducer,
    userLocation: userLocationSliceReducer,
    modal: modalSliceReducer,
    data:dataSlice,
  },
});

export default store;

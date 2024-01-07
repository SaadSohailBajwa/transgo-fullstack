import { createSlice } from "@reduxjs/toolkit";
import modalSlice from "./modalSlice";

const initialState = {
  nearestDrivers: null,
  rideData: null,
  rideDriverId: null,
  rideState: "offline",
  ridePhase: "one",
  rideShipmentId: null,
  profilePicture: null,
  licensePicture: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setNearestDrivers: (state, action) => {
      state.nearestDrivers = action.payload;
    },
    setRideData: (state, action) => {
      state.rideData = action.payload;
    },
    setRideDriverId: (state, action) => {
      state.rideDriverId = action.payload;
    },
    setRidePhase: (state, action) => {
      state.ridePhase = action.payload;
    },
    setRideState: (state, action) => {
      state.rideState = action.payload;
    },
    setRideShipmentId: (state, action) => {
      state.rideShipmentId = action.payload;
    },
    setProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
    },
    setLicensePicture: (state, action) => {
      state.licensePicture = action.payload;
    },
  },
});

export const {
  setNearestDrivers,
  setRideData,
  setRideDriverId,
  setRideState,
  setRideShipmentId,
  setRidePhase,
  setProfilePicture,
  setLicensePicture,
} = dataSlice.actions;

export default dataSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userCurrentLocation: {
    location: {
      lat: 31.4806,
      lng: 74.3198,
    },
  },
  userStartLocation: null,
  userDestinationLocation: null,
  userDistance: null,
  driverCurrentLocation:null,
};

const jwtSlice = createSlice({
  name: "userLocation",
  initialState,
  reducers: {
    setUserStartLocation: (state, action) => {
      state.userStartLocation = action.payload;
    },
    setUserDestinationLocation: (state, action) => {
      state.userDestinationLocation = action.payload;
    },
    setUserCurrentLocation: (state, action) => {
      state.userCurrentLocation = action.payload;
    },
    setUserDistance: (state, action) => {
      state.userDistance = action.payload;
    },
    setDriverCurrentLocation:(state,action)=>{
      state.driverCurrentLocation = action.payload
    }
  },
});

export const { setUserStartLocation,setUserDestinationLocation, setUserCurrentLocation,setUserDistance ,setDriverCurrentLocation } = jwtSlice.actions;
export default jwtSlice.reducer;


//start&destination same
// setUserStartLocation({
//   location: details?.geometry?.location,=> {lat:,lng:,}
//   description: data.description,
// });

// both of these have same location chaining 
// i.e userStartLocation.location.lat/lng 

// setUserCurrentLocation({
//   location:{
//      lat:location.coords.latitude,
//      lng: location.coords.longitude
//             } 
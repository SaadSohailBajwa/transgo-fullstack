import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rideRequestModal: false,
  rideResponse:null,
  showChat:false,
  chatNotification:false,
  reviewModal:false,
};
//rideRequest 
const modeSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setRideRequestModal: (state, action) => {
      state.rideRequestModal = action.payload;
    },
    setRideResponse: (state, action) => {
      state.rideResponse = action.payload;
    },
    setShowChat: (state, action) => {
      state.showChat = action.payload;
    },
    setChatNotification: (state,action) =>{
      state.chatNotification = action.payload
    },
    setReviewModal:(state,action)=>{
      state.reviewModal = action.payload
    }
  },
});

export const { setRideRequestModal,setRideResponse,setShowChat,setChatNotification,setReviewModal } = modeSlice.actions;
export default modeSlice.reducer;

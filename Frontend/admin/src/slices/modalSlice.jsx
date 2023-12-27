import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    showUserModal : false,
    showDriverModal: false,
    showPendingDriverModal: false,
}


const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setShowUserModal: (state, action) => {
      state.showUserModal = action.payload;
    },
    setShowDriverModal: (state, action) => {
      state.showDriverModal = action.payload;
    },
    setShowPendingDriverModal: (state, action) => {
      state.showPendingDriverModal = action.payload;
    },
  },
});

export const {setShowUserModal,setShowDriverModal,setShowPendingDriverModal} = modalSlice.actions;

export default modalSlice.reducer;
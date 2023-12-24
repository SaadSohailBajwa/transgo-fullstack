import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    showUserModal : false,
    showDriverModal: false,
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
  },
});

export const {setShowUserModal,setShowDriverModal} = modalSlice.actions;

export default modalSlice.reducer;
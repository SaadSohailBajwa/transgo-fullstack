import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    phoneNumber:'',
    phoneNumberExist:false,
    phoneNumberValid:false,
}

const phoneNumberSlice = createSlice({
  name: "phoneNumber",
  initialState,
  reducers: {
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload
    },
    setPhoneNumberExist:(state,action)=>{
      state.phoneNumberExist = action.payload
    },
    setPhoneNumberValid:(state,action)=>{
      state.phoneNumberValid = action.payload
    }
  },
  
  
});

export const { setPhoneNumber,setPhoneNumberExist,setPhoneNumberValid } = phoneNumberSlice.actions;
export default phoneNumberSlice.reducer;

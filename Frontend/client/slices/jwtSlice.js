import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token:null,
  firstName:null,
  lastName:null,
  email:null,
  phoneNumber:null,
  id:null,
  isLoggedIn:false,
  refreshToken:null
};

const jwtSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token
      state.firstName = action.payload.firstname
      state.lastName = action.payload.lastname
      state.email = action.payload.email
      state.phoneNumber = action.payload.phoneNumber
      state.id = action.payload.id
      state.refreshToken = action.payload.refreshToken
    },
    setIsLoggedIn: (state,action)=>{
      state.isLoggedIn = action.payload
    },
    setAccessToken:(state,action)=>{
      state.token = action.payload
    },
    setId:(state,action)=>{
      state.id = action.payload
    }
  } 
});

export const { setToken,setIsLoggedIn,setAccessToken,setId } = jwtSlice.actions;
export default jwtSlice.reducer;

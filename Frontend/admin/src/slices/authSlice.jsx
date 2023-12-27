import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loginState : false,
    token: "",
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoginState: (state,action) =>{
            state.loginState = action.payload
        },
        setToken: (state,action)=>{
            state.token = action.payload
        }
    }
})

export const {setLoginState,setToken} = authSlice.actions;

export default authSlice.reducer;
import {configureStore} from '@reduxjs/toolkit'
import navSliceReducer from './slices/navSlice'
import modalSliceReducer from './slices/modalSlice';
import authSliceReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    nav:navSliceReducer,
    modal: modalSliceReducer,
    auth : authSliceReducer
  }
})

export default store;
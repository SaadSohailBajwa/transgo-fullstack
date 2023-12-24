import {configureStore} from '@reduxjs/toolkit'
import navSliceReducer from './slices/navSlice'
import modalSliceReducer from './slices/modalSlice';

const store = configureStore({
  reducer: {
    nav:navSliceReducer,
    modal: modalSliceReducer,
  }
})

export default store;
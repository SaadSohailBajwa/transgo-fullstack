import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import NavigationBar from './components/NavigationBar'
import Dashboard from './components/Dashboard'
import Drivers from './components/Drivers'
import Users from './components/Users'
import { Route, Routes,Navigate } from 'react-router-dom'
import PendingDrivers from './components/PendingDrivers'
import { useDispatch, useSelector } from 'react-redux'
import Login from './components/Login'
import { setLoginState,setToken } from './slices/authSlice'

function App() {
  const {loginState} = useSelector(state=>state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      dispatch(setLoginState(true));
      dispatch(setToken(storedToken))
    }else{
      dispatch(setToken(""));
    }
  }, [dispatch]);

  return (
    <>
      {loginState && <NavigationBar />}

      <Routes>
        {loginState ? (
          <>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Drivers" element={<Drivers />} />
            <Route path="/Users" element={<Users />} />
            <Route path="/Pending" element={<PendingDrivers />} />
            <Route path="*" element={<Navigate to="/Dashboard" />} />
          </>
        ) : (
          <Route path="*" element={<Login />} />
        )}
      </Routes>
    </>
  );
}

export default App

import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import NavigationBar from './components/NavigationBar'
import Dashboard from './components/Dashboard'
import Drivers from './components/Drivers'
import Users from './components/Users'
import { Route, Routes } from 'react-router-dom'

function App() {
  

  return (
    <>
      <NavigationBar />

      <Routes>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Drivers" element={<Drivers />} />
        <Route path="/Users" element={<Users/>} />
      </Routes>
    </>
  );
}

export default App

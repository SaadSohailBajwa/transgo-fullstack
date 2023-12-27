import React, { useState } from "react";
import Logo from "../assets/logo.png";
import Urls from "../../constants/Urls";
import { setLoginState, setToken } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
    const dispatch = useDispatch()

  const loginRequest = async () => {
    try {
      const response = await axios.post(`http://${Urls.auth}/auth/user/login`, {
        phoneNumber: phoneNumber,
        password: password,
        type: "admin",
      });
      //dispatch(setPhoneNumberExist(response.data));
      console.log("status:", response.status);
      console.log("data: ",response.data)
      if (response.status === 200) {
        dispatch(setToken(response.data.token));
        dispatch(setLoginState(true))
        localStorage.setItem("token", response.data.token);

        
      }
      //

      console.log("Data:", response.data);
    } catch (error) {
      console.error("Error posting data:", error);

      if (error.response.status === 401) {
        //if wrong pass then logic here
        setError(true);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center flex-col">
        <img src={Logo} alt="Logo" className="w-1/2 h-auto" />
      </div>

      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone Number:
            </label>
            <input
              type="text"
              className="w-full border rounded py-2 px-3"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password:
            </label>
            <div className="flex items-center relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border rounded py-2 px-3 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-2 rounded "
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={loginRequest}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

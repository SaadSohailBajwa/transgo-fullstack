import React, { useState } from 'react'
import Logo from "../assets/logo.png"
import { Link,useLocation } from 'react-router-dom'
import { useSelector,useDispatch } from "react-redux";
import { setRoute } from '../slices/navSlice';
import { setLoginState,setToken } from '../slices/authSlice';
import { MdLogout } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";




const navLinks = [
  {
    name: "Dashboard",
    icon: "",
  },
  {
    name: "Drivers",
    icon: "",
  },
  {
    name: "Users",
    icon: "",
  },
  {
    name: "Pending",
    icon: "",
  },
];

function NavigationBar() {
  const {route}  = useSelector((state) => state.nav);
  const dispatch = useDispatch()

  const [selected, setSelected] = useState(0)

  const location = useLocation();

  console.log(location.pathname)
  const currentRoute = location.pathname

  switch (currentRoute) {
    case "/Dashboard":
      dispatch(setRoute(0));
      break;
    case "/Drivers":
      dispatch(setRoute(1));
      break;
    case "/Users":
      dispatch(setRoute(2));
      break;
    case "/Pending":
      dispatch(setRoute(3));
      break;
  }

  const setRouteFunction = (index)=>{
    dispatch(setRoute(index))
    setSelected(index)
  }

  return (
    <div className="px-2 py-2 flex flex-col border border-r-1 w-[10%] h-screen fixed left-0 top-0 ">
      <div className="logo-div flex space-x-0 items-center">
        <img src={Logo} />
      </div>
      <div className="mt-10 flex flex-col space-y-8 text-center ">
        {navLinks.map((item, index) => (
          <Link to={`/${item.name}`}>
            <div
              className={
                "flex space-x-3 px-8 py-2 rounded text-center " +
                (route === index ? " bg-[blue] text-white font-bold" : "")
              }
              onClick={() => {
                setSelected(index);
                setRouteFunction(index);
              }}
            >
              <span className="text-center">{item.name}</span>
            </div>
          </Link>
        ))}
        <div
          className="flex items-center space-x-3 px-8 py-2 absolute bottom-5 rounded text-center cursor-pointer"
          onClick={()=>{
            dispatch(setLoginState(false));
            dispatch(setToken(""));
            localStorage.setItem("token", "");
          }}
        >
          <span className="text-center text-red-500">
            <BiLogOut className="inline-block mr-2" size={25} />
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}

export default NavigationBar
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShowUserModal } from "../slices/modalSlice";
import { setLoginState,setToken } from "../slices/authSlice";
import axios from "axios";
import Urls from "../../constants/Urls";

const UserModal = ({ id }) => {
  const { showUserModal } = useSelector((state) => state.modal);
  const [row, setRow] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://${Urls.admin}/admin/user/get/${id}`
        );
        if (response.data && response.data.length > 0) {
          setRow(response.data[0]);
          console.log(response.data[0]);
        }
      } catch (err) {
        console.error("Error in useEffect fetchUsers:", err);
        if (err.response && err.response.status === 403) {
          // Dispatch actions to update authentication state
          dispatch(setLoginState(false));
          dispatch(setToken(""));
          localStorage.setItem("token", "");
        }
      }
    };
    fetchUser();
  }, [id]);

  const update = async ()=>{
    console.log(row)
    try{
      const request = await axios.put(
        `http://${Urls.admin}/admin/user/update`,row
      );
    }catch(err){
      console.log("error in user Update")
      if (err.response && err.response.status === 403) {
        // Dispatch actions to update authentication state
        dispatch(setLoginState(false));
        dispatch(setToken(""));
        localStorage.setItem("token", "");
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRow((prevRow) => ({ ...prevRow, [name]: value }));
  };

  return (
    showUserModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-lg">
          <h2 className="block text-sm font-medium text-gray-700">ID</h2>
          <h1>{id}</h1>
          <form className="space-y-4">
            <div className="mb-4">
              <label
                htmlFor="phonenumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phonenumber"
                className="mt-1 p-2 border rounded-md w-full"
                value={row.phonenumber || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                className="mt-1 p-2 border rounded-md w-full"
                value={row.email || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                className="mt-1 p-2 border rounded-md w-full"
                value={row.firstname || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                className="mt-1 p-2 border rounded-md w-full"
                value={row.lastname || ""}
                onChange={handleInputChange}
              />
            </div>
            
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              onClick={()=>{
                update();
                dispatch(setShowUserModal(!showUserModal))}}
            >
              Update
            </button>
            <button
              type="button"
              className="bg-red-400 text-white py-2 px-4 ml-2 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
            <button
              type="button"
              className="border-blue-500 border-1 rounded p-2 px-4 ml-2"
              onClick={() => {
                dispatch(setShowUserModal(!showUserModal));
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default UserModal;

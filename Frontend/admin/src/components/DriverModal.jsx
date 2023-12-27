import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShowDriverModal, setShowUserModal } from "../slices/modalSlice";
import axios from "axios";
import Urls from "../../constants/Urls";
import { setLoginState,setToken } from "../slices/authSlice";

const DriverModal = ({ id }) => {
  const { showDriverModal } = useSelector((state) => state.modal);
  const [row, setRow] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://${Urls.admin}/admin/driver/get/${id}`
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

  const update = async () => {
    console.log(row);
    try {
      const request = await axios.put(
        `http://${Urls.admin}/admin/user/update`,
        row
      );
    } catch (err) {
      console.log("error in user Update");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRow((prevRow) => ({ ...prevRow, [name]: value }));
  };

  return (
    showDriverModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-lg">
          <h2 className="block text-sm font-medium text-gray-700">ID</h2>
          <h1>{id}</h1>
          <form className="space-y-4">
            <div className="mb-4">
              <label
                htmlFor="cnic"
                className="block text-sm font-medium text-gray-700"
              >
                CNIC
              </label>
              <input
                type="text"
                name="cnic"
                className="mt-1 p-2 border rounded-md w-full"
                value={row.cnic || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="license_number"
                className="block text-sm font-medium text-gray-700"
              >
                License Number
              </label>
              <input
                type="text"
                name="license_number"
                className="mt-1 p-2 border rounded-md w-full"
                value={row.license_number || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="license_plate"
                className="block text-sm font-medium text-gray-700"
              >
                License Plate
              </label>
              <input
                type="text"
                name="license_plate"
                className="mt-1 p-2 border rounded-md w-full"
                value={row.license_plate || ""}
                onChange={handleInputChange}
              />
            </div>
            
            
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              onClick={() => {
                update();
                dispatch(setShowDriverModal(!showDriverModal));
              }}
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
                dispatch(setShowDriverModal(!showDriverModal));
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

export default DriverModal;

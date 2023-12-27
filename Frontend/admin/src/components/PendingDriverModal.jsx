import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShowPendingDriverModal } from "../slices/modalSlice";
import axios from "axios";
import Urls from "../../constants/Urls";

const PendingDriverModal = ({ id }) => {
  const { showPendingDriverModal } = useSelector((state) => state.modal);
  const {token} = useSelector(state=>state.auth)
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
    console.log("row when sent to update",row);
    try {
      const request = await axios.patch(
        `http://${Urls.admin}/admin/driver/verify`,
        row,
        {
          headers:{
            token:token
          }
        }
        
      );
    } catch (err) {
      console.log("error in driver verify ",err);
      if (err.response && err.response.status === 403) {
        // Dispatch actions to update authentication state
        dispatch(setLoginState(false));
        dispatch(setToken(""));
        localStorage.setItem("token", "");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRow((prevRow) => ({ ...prevRow, [name]: value }));
    console.log("row on input change",row)
  };

  return (
    showPendingDriverModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-lg">
          <h2 className="block text-sm font-medium text-gray-700">ID</h2>
          <h1>{id}</h1>
          <h2 className="block text-sm font-medium text-gray-700">
            Phone Number
          </h2>
          <h1>{row.phonenumber}</h1>
          <h2 className="block text-sm font-medium text-gray-700">Email</h2>
          <h1>{row.email}</h1>
          <h2 className="block text-sm font-medium text-gray-700">
            First Name
          </h2>
          <h1>{row.firstname}</h1>
          <h2 className="block text-sm font-medium text-gray-700">Last Name</h2>
          <h1>{row.lastname}</h1>
          <h2 className="block text-sm font-medium text-gray-700">CNIC</h2>
          <h1>{row.cnic}</h1>
          <h2 className="block text-sm font-medium text-gray-700">
            License Number
          </h2>
          <h1>{row.license_number}</h1>
          <h2 className="block text-sm font-medium text-gray-700">
            License Plate
          </h2>
          <h1>{row.license_plate}</h1>
          <h2 className="block text-sm font-medium text-gray-700">
            License Image
          </h2>
          <img
            src={
              row.license_picture_url ||
              "https://pbs.twimg.com/profile_images/1438817879332425730/anYBmFZz_400x400.jpg"
            }
            alt="Profile"
            className="w-8 h-8 "
          />
          <form className="space-y-4">
            <div className="mb-4">
              <label
                htmlFor="verified"
                className="block text-sm font-medium text-gray-700"
              >
                verified
              </label>
              <select
                name="verified"
                id="verified"
                className="mt-1 p-2 border rounded-md w-full"
                value={row.verified || ""}
                onChange={handleInputChange}
              >
                <option value="false">Pending</option>
                <option value="true">Verified</option>
                
              </select>
            </div>
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              onClick={() => {
                update();
                dispatch(setShowPendingDriverModal(!showPendingDriverModal));
              }}
            >
              Update
            </button>
            
            <button
              type="button"
              className="border-blue-500 border-1 rounded p-2 px-4 ml-2"
              onClick={() => {
                dispatch(setShowPendingDriverModal(!showPendingDriverModal));
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

export default PendingDriverModal;

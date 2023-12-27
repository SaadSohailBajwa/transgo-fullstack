import React, { useState, useEffect } from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { setShowUserModal } from "../slices/modalSlice";
import { useSelector, useDispatch } from "react-redux";
import { setShowPendingDriverModal } from "../slices/modalSlice";
import axios from "axios";
import Urls from "../../constants/Urls";
import DriverModal from "./DriverModal";
import PendingDriverModal from "./PendingDriverModal";
import { MdVerified, MdOutlinePending } from "react-icons/md";
import { setLoginState,setToken } from "../slices/authSlice";

const PendingDrivers = () => {
  const [rows, setRows] = useState([]);
  const [modalPropId, setModalPropId] = useState(null);
  const { showPendingDriverModal } = useSelector((state) => state.modal);
  const { route } = useSelector((state) => state.nav);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://${Urls.admin}/admin/driver/get/all/pending`
        );
        if (response.data) {
          setRows(response.data);
          console.log(response.data);
        }
      } catch (err) {
        console.log("error in useEffect fetchUsers: ", err);
        if (err.response && err.response.status === 403) {
          // Dispatch actions to update authentication state
          dispatch(setLoginState(false));
          dispatch(setToken(""));
          localStorage.setItem("token", "");
        }
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="ml-[10%] p-8">
      <div className="flex flex-col space-y-6 py-12 px-14 bg-white border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Pending Drivers</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Verified</th>
              <th className="py-2 px-4">Phone Number</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">First Name</th>
              <th className="py-2 px-4">Last Name</th>
              <th className="py-2 px-4">CNIC</th>
              <th className="py-2 px-4">License Number</th>
              <th className="py-2 px-4">License Plate</th>
              <th className="py-2 px-4">Driver Status</th>
              <th className="py-2 px-4">License Image</th>
              <th className="py-2 px-4">Edit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100 transition">
                <td className="py-2 px-4">{row.id}</td>
                <td className="py-2 px-4">
                  {row.verified ? (
                    <MdVerified color="green" size={24} />
                  ) : (
                    <MdOutlinePending color="orange" size={24} />
                  )}
                </td>
                <td className="py-2 px-4">{row.phonenumber}</td>
                <td className="py-2 px-4">{row.email}</td>
                <td className="py-2 px-4">{row.firstname}</td>
                <td className="py-2 px-4">{row.lastname}</td>
                <td className="py-2 px-4">{row.cnic}</td>
                <td className="py-2 px-4">{row.license_number}</td>
                <td className="py-2 px-4">{row.license_plate}</td>
                <td className="py-2 px-4">{row.driver_status}</td>
                <td className="py-2 px-4">
                  <img
                    src={
                      row.license_picture_url ||
                      "https://pbs.twimg.com/profile_images/1438817879332425730/anYBmFZz_400x400.jpg"
                    }
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                </td>

                <td className="py-2 px-4">
                  <span
                    className="cursor-pointer text-blue-500"
                    onClick={() => {
                      dispatch(
                        setShowPendingDriverModal(!showPendingDriverModal)
                      );
                      console.log(row.id);
                      console.log(showPendingDriverModal);
                      setModalPropId(row.id);
                    }}
                  >
                    <BsFillPencilFill />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PendingDriverModal id={modalPropId} />
      </div>
    </div>
  );
};

export default PendingDrivers;

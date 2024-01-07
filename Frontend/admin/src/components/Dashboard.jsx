import React,{useState,useEffect} from "react";
import {
  FaUserFriends,
  FaCheckCircle,
  FaClock,
  FaRoute,
  FaRegMoneyBillAlt,
} from "react-icons/fa";
import NavigationBar from "./NavigationBar";
import { Link } from "react-router-dom";
import DashboardPieChart from "./DashboardPieChart";
import Urls from "../../constants/Urls";
import axios from "axios";
import DashboardBarChart from "./DashboardBarChart";

const Dashboard = () => {

  const [shipmentStatusData, setShipmentStatusData] = useState([]);
  const [shipmentVehicleData,setShipmentVehicleData] = useState([])
  const [onlineDrivers,setOnlineDrivers] = useState(null)
  const [unverifiedDrivers,setUnverifiedDrivers] = useState(null)
  const [otherStatusDrivers,setOtherStatusDrivers] = useState(null)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://${Urls.admin}/admin/dashboard`
        ); // Replace with your actual server endpoint
        setShipmentStatusData(response.data.shipmentStatus);
        setShipmentVehicleData(response.data.vehicleType)
        setOnlineDrivers(response.data.onlineDrivers)
        setUnverifiedDrivers(response.data.unverifiedDrivers)
        setOtherStatusDrivers(response.data.otherStatusDrivers)
        console.log(shipmentStatusData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <>
      <NavigationBar />
      <div className="ml-[10%] p-8">
        <div className="flex flex-col space-y-6 py-12 px-14 ">
          <h2 className="text-3xl font-semibold">Dashboard</h2>

          <div className="flex flex-wrap gap-8">
            <div className="flex-1 bg-white border border-gray-200 p-6 rounded-lg shadow-md">
              <FaUserFriends className="text-4xl text-blue-500 mb-2" />
              <span className="text-gray-600">Online Drivers: </span>
              <span className="text-gray-500">{onlineDrivers}</span>
            </div>
            <div className="flex-1 bg-white border border-gray-200 p-6 rounded-lg shadow-md">
              <FaRoute className="text-4xl text-green-500 mb-2" />
              <span className="text-gray-600">Active Drivers: </span>
              <span className="text-gray-500">{otherStatusDrivers}</span>
            </div>
            <Link
              to="/Pending"
              className="flex-1 bg-white border border-gray-200 p-6 rounded-lg shadow-md"
            >
              <FaClock className="text-4xl text-yellow-500 mb-2" />
              <span className="text-gray-600">Unapproved Drivers: </span>
              <span className="text-gray-500">{unverifiedDrivers}</span>
            </Link>
          </div>

          <div className="flex gap-8">
            <div className="w-2/3 flex items-stretch">
              <div className="flex-1 bg-white border border-gray-200 p-6 pt-6 rounded-lg shadow-md">
                <DashboardBarChart
                  vehicleData={shipmentVehicleData}
                  chartWidth={300}
                  chartHeight={150}
                />
              </div>
            </div>
            <div className="w-1/3 flex flex-col gap-4">
              <div className="flex-1 bg-white border border-gray-200 p-6 rounded-lg shadow-md">
                <FaRegMoneyBillAlt className="text-4xl text-green-600 mb-2" />
                <span className="text-gray-600">Total Earnings</span>
                <span className="text-gray-500"> 2</span>
              </div>
              <div className="flex-1 bg-white border border-gray-200 p-6 rounded-lg shadow-md">
                <DashboardPieChart
                  shipmentStatusData={shipmentStatusData}
                  chartWidth={150}
                  chartHeight={150}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

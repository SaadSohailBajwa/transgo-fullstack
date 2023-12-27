import React from "react";
import { FaUserFriends, FaCheckCircle, FaClock, FaRoute } from "react-icons/fa";
import NavigationBar from "./NavigationBar";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <NavigationBar />
      <div className="ml-[10%] p-8">
        <div className="flex flex-col space-y-6 py-12 px-14">
          <h2 className="text-3xl font-semibold">Dashboard</h2>
          <div className="flex flex-wrap gap-8">
            <div className="flex-1 bg-white border border-gray-200 p-6 rounded-lg shadow-md">
              <FaUserFriends className="text-4xl text-blue-500 mb-2" />
              <span className="text-gray-600">Online Drivers</span>
              <span className="text-gray-500"> 2</span>
            </div>
            <div className="flex-1 bg-white border border-gray-200 p-6 rounded-lg shadow-md">
              <FaRoute className="text-4xl text-gray-500 mb-2" />
              <span className="text-gray-600">Active Drivers</span>
              <span className="text-gray-500"> 2</span>
            </div>
            <Link
              to="/Pending"
              className="flex-1 bg-white border border-gray-200 p-6 rounded-lg shadow-md"
            >
              <FaClock className="text-4xl text-yellow-500 mb-2" />
              <span className="text-gray-600">Unapproved Drivers</span>
              <span className="text-gray-500"> 2</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

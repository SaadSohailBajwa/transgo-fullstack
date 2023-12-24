import React from 'react'
import NavigationBar from './NavigationBar';

const Dashboard = () => {
  return (
    <>
      <div className="ml-[10%] p-8">
        <div className="flex flex-col space-y-6 py-12 px-14">
          <h2>Dashboard</h2>
          <div className="flex space-x-8">
            <div className="w-2/5 h-[150px] border border-gray-500 rounded flex flex-col justify-center p-4 text-gray-500 ">
              <span>online drivers</span>
              <span className="text-gray-500">amount: 2</span>
            </div>
            <div className="w-2/5 h-[150px] border border-gray-500 rounded flex flex-col justify-center p-4 text-gray-500 ">
              <span>active drivers</span>
              <span className="text-gray-500">amount: 2</span>
            </div>
            <div className="w-2/5 h-[150px] border border-gray-500 rounded flex flex-col justify-center p-4 text-gray-500 ">
              <span>UnApproved Drivers</span>
              <span className="text-gray-500">amount: 2</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard
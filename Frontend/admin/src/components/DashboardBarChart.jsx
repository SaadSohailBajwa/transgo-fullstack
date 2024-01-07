import React from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const DashboardBarChart = ({ vehicleData, chartWidth, chartHeight }) => {
  const chartData = {
    labels: vehicleData.map((vehicle) => vehicle.type),
    datasets: [
      {
        label: "Number of Vehicles",
        data: vehicleData.map((vehicle) => vehicle.count),
        backgroundColor: [
          "rgba(0, 0, 255, 0.6)",
          "rgba(30, 144, 255, 0.6)",
          "rgba(70, 130, 180, 0.6)",
          "rgba(100, 149, 237, 0.6)",
          // Add more colors if needed
        ],
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Vehicle Types",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Vehicles",
        },
      },
    },
  };

  return (
    <div>
      <Bar
        data={chartData}
        options={chartOptions}
        width={chartWidth}
        height={chartHeight}
      />
      <h2>Vehicle Type Distribution</h2>
    </div>
  );
};

export default DashboardBarChart;

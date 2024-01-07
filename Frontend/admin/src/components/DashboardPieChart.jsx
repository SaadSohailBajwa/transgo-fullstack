import React from "react";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto"; // Import Chart from chart.js

const DashboardPieChart = ({ shipmentStatusData, chartWidth, chartHeight }) => {
  const chartData = {
    labels: shipmentStatusData.map((status) => status.status),
    datasets: [
      {
        data: shipmentStatusData.map((status) => status.count),
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

  return (
    <div>
      
      <Pie data={chartData} width={chartWidth} height={chartHeight} />
      <h2>Shipment Status Distribution</h2>
    </div>
  );
};

export default DashboardPieChart;

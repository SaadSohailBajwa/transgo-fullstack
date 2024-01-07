const express = require("express");
const router = express.Router();

const authorization = require("../middleware/authorization");

const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    console.log("got req on getDashboardData route");

    // Example: Fetch count of shipments in different statuses
    const shipmentStatusQuery =
      "SELECT status, COUNT(*) as count FROM shipment GROUP BY status";
    const shipmentStatusResult = await pool.query(shipmentStatusQuery);

    // Example: Fetch count of vehicles by type
    const vehicleTypeQuery =
      "SELECT type, COUNT(*) as count FROM vehicles GROUP BY type";
    const vehicleTypeResult = await pool.query(vehicleTypeQuery);

    // Example: Fetch count of online drivers
    const onlineDriversQuery =
      "SELECT COUNT(*) FROM drivers WHERE driver_status = 'online'";
    const onlineDriversResult = await pool.query(onlineDriversQuery);
    const onlineDriversCount = onlineDriversResult.rows[0].count;

    // Example: Fetch count of unverified drivers
    const unverifiedDriversQuery =
      "SELECT COUNT(*) FROM drivers WHERE verified = false";
    const unverifiedDriversResult = await pool.query(unverifiedDriversQuery);
    const unverifiedDriversCount = unverifiedDriversResult.rows[0].count;

    // Example: Fetch count of drivers with status neither offline nor online
    const otherStatusDriversQuery =
      "SELECT COUNT(*) FROM drivers WHERE driver_status NOT IN ('offline', 'online')";
    const otherStatusDriversResult = await pool.query(otherStatusDriversQuery);
    const otherStatusDriversCount = otherStatusDriversResult.rows[0].count;

    // Prepare data for response
    const dashboardData = {
      shipmentStatus: shipmentStatusResult.rows,
      vehicleType: vehicleTypeResult.rows,
      onlineDrivers: onlineDriversCount,
      unverifiedDrivers: unverifiedDriversCount,
      otherStatusDrivers: otherStatusDriversCount,
      // Add more properties/data as needed...
    };

    // Send the data as JSON response
    res.json(dashboardData);
  } catch (err) {
    console.log("error in getDashboardData route ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

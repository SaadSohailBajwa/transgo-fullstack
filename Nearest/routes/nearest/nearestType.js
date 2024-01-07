const express = require("express");
const router = express.Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {
    //destructure from the req.body

    // destructure from the req.params
    const { lat, lng, radius, type } = req.query;
    console.log(req.user.user, req.user.userType, type, lat, lng, radius);
    console.log(req.body);

    //sql query
    const searchQuery = `
     SELECT
        drivers.id AS driver_id,
        users.firstname,
        users.lastname,
        users.phonenumber,
        vehicles.license_plate,
        vehicles.type,
        vehicles.vehicle_picture_url,
        ST_X(drivers.location::geometry) AS driver_longitude,
        ST_Y(drivers.location::geometry) AS driver_latitude
      FROM
        drivers
      INNER JOIN
        users ON drivers.id = users.id
      INNER JOIN
        vehicles ON drivers.license_plate = vehicles.license_plate
      WHERE
        vehicles.type = $1
        AND ST_DWithin(drivers.location, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4)
        AND drivers.driver_status = 'online'
      ORDER BY
        ST_Distance(drivers.location, ST_SetSRID(ST_MakePoint($2, $3), 4326))

    `;

    //performing the query on the driver table
    const nearbyDriver = await pool.query(searchQuery, [
      type,
      lng,
      lat,
      radius,
    ]);

    //send driver id, lat and lng
    console.log("the result from sql query:", nearbyDriver.rows);
    res.status(200).json(nearbyDriver.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

module.exports = router;

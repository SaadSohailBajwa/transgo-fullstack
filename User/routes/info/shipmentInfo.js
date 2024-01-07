const express = require("express");
const router = express.Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");

const query = `SELECT
    users.firstname,
    users.lastname,
    users.profile_picture_url,
    drivers.license_plate,
    vehicles.type,
    shipment.start_time,
    shipment.end_time,
    shipment.fare,
    ST_Y(shipment.start_location::geometry) AS start_lat,
    ST_X(shipment.start_location::geometry) AS start_lng,
    ST_Y(shipment.destination_location::geometry) AS dest_lat,
    ST_X(shipment.destination_location::geometry) AS dest_lng,
    shipment.id,
    shipment.status,
    shipment.driver_id,
	shipment.user_id
FROM
    (((drivers
    INNER JOIN users ON users.id = drivers.id)
    INNER JOIN shipment ON drivers.id = shipment.driver_id)
    INNER JOIN vehicles ON drivers.license_plate = vehicles.license_plate)
WHERE
    shipment.user_id = $1
ORDER BY
    shipment.start_time DESC;`;

router.get("/shipment/all/:id", async(req,res)=>{
    console.log("got req on get /shipment/all/:id");
    const id = req.params.id;
    try{
        const shipments = await pool.query(query,[id])
        console.log(shipments.rows)
        res.json(shipments.rows)
        
    }catch(err){
        console.log("error inside get info/shipment/all")
        res.status(500).send("Internal Server Error");
    }
})










module.exports = router;
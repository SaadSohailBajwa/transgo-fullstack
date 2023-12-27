const express = require("express");
const router = express.Router();

const authorization = require("../middleware/authorization");

const pool = require("../db");

router.get("/get/all", async (req, res) => {
  try {
    console.log("got get all drivers request");

    const getAllDrivers = await pool.query(
      `SELECT users.id,users.phonenumber,users.email,users.firstname, users.lastname, drivers.verified, drivers.cnic, drivers.license_number, drivers.license_plate,drivers.driver_status,drivers.license_picture_url from drivers INNER JOIN users on drivers.id = users.id ` 
    );

    console.log("query getAllDrivers: success");

    res.status(200).json(getAllDrivers.rows);
  } catch (err) {
    console.log("error from getAllDrivers: ", err);
  }
});

router.get("/get/all/pending", async (req, res) => {
  try {
    console.log("got get all drivers request");

    const getAllDrivers = await pool.query(
      `SELECT users.id,users.phonenumber,users.email,users.firstname, users.lastname, drivers.verified, drivers.cnic, drivers.license_number, drivers.license_plate,drivers.driver_status,drivers.license_picture_url from drivers INNER JOIN users on drivers.id = users.id WHERE drivers.verified = false `
    );

    console.log("query getAllDrivers: success");

    res.status(200).json(getAllDrivers.rows);
  } catch (err) {
    console.log("error from getAllDrivers: ", err);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const authorization = require("../middleware/authorization");

const pool = require("../db");

router.get("/get/:id", async (req, res) => {
  try {
    console.log("got get a driver request");
    const id = req.params.id;

    const getUser = await pool.query(
      `SELECT users.id,users.phonenumber,users.email,users.firstname, users.lastname, drivers.verified, drivers.cnic, drivers.license_number, drivers.license_plate,drivers.driver_status,drivers.license_picture_url from drivers INNER JOIN users on drivers.id = users.id WHERE users.id = $1`,
      [id]
    );

    console.log("query getDriver: success");

    res.status(200).json(getUser.rows);
  } catch (err) {
    console.log("error from getDriver: ", err);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const db = require("../../models/index");
const { users } = db;

router.post("/validateNumber", async (req, res) => {
  // Checks if number already exists in the database
  // if not then returns true

  try {
    const { phoneNumber,type } = req.body;

    //Validate the phone number format
    const regex = /^03\d{9}$/;

    if (!regex.test(phoneNumber)) {
      return res.status(200).json("Invalid phone number format");
    }

    const user = await users.findOne({ where: { phonenumber: phoneNumber, type: type} });
    // const userType = await users.findOne({ where: {  } });

    if (user) {
      //return true if user already exists
      return res.status(200).json(true);
    }

    //return false if number does not exist
    return res.json(false);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;

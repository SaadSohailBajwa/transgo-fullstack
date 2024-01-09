const express = require("express");
const router = express.Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");

function formatDimensions(length, width, height) {
  // if (
  //   typeof length !== "number" ||
  //   typeof width !== "number" ||
  //   typeof height !== "number"
  // ) {
  //   throw new Error("All inputs must be numbers");
  // }

  return `${length}x${width}x${height}`;
}


// Update user profile route
router.post("/add", authorization, async (req, res) => {
  console.log("got request on http://localhost:3002/driver/info/")
  console.log(req.user);
  const {cnic,licenseNumber,licensePlate,type,length,width,height} = req.body
  const {user, userType} = req.user;
  // const {} = req.file
  console.log(formatDimensions(length,width,height))
  const capacity = formatDimensions(length, width, height);
  
  const queryDriver = `
    INSERT INTO drivers (
      id,
      verified,
      cnic,
      license_number,
      license_plate,
      driver_status,
      license_picture_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;

  const queryVehicle = `
  INSERT INTO vehicles(
    license_plate,
    type,
    vehicle_picture_url,
    capacity
  )
  VALUES ($1, $2, $3,$4)`
  console.log(user, false, cnic, licenseNumber, licensePlate);
  try{

    

    await pool.query("BEGIN")
    
    const resultVehicle = await pool.query(queryVehicle, [
      licensePlate,
      type,
      "https://pbs.twimg.com/profile_images/1438817879332425730/anYBmFZz_400x400.jpg",
      capacity

    ]);
    
    const resultDriver = await pool.query(queryDriver, [
      user,
      false,
      cnic,
      licenseNumber,
      licensePlate,
      "offline",
      "https://transgo.s3.me-south-1.amazonaws.com/profile-picture/",
    ]);

    

    await pool.query("COMMIT")

    res.status(200).send("Transaction completed successfully");
  }
  catch(err){
    console.log("the error is:" ,err)
    await pool.query("ROLLBACK");
    res.status(500).send("Error during transaction");
  }
  
  

});

module.exports = router;

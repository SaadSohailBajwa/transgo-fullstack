const express = require("express");
const router = express.Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");

// Update user profile route
router.post("/add", authorization, async (req, res) => {
  console.log("got request on http://localhost:3002/driver/info/")
  console.log(req.user);
  const {cnic,licenseNumber,licensePlate,type} = req.body
  const {user, userType} = req.user;
  // const {} = req.file
  

  
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
    vehicle_picture_url
  )
  VALUES ($1, $2, $3)`
  console.log(user, false, cnic, licenseNumber, licensePlate);
  try{

    

    await pool.query("BEGIN")
    
    const resultVehicle = await pool.query(queryVehicle, [
      licensePlate,
      type,
      "https://pbs.twimg.com/profile_images/1438817879332425730/anYBmFZz_400x400.jpg",
    ]);
    
    const resultDriver = await pool.query(queryDriver,[
      user,
      false,
      cnic,
      licenseNumber,
      licensePlate,
      "offline",
      "https://pbs.twimg.com/profile_images/1438817879332425730/anYBmFZz_400x400.jpg"
    ])

    

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

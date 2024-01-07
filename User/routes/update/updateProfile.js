const express = require("express");
const router = express.Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization")

// Update user profile route
router.put("/",authorization, async (req, res) => {
  
  console.log("got request on http://localhost:3001/user/update/");  
  
  
  const { phoneNumber, firstName, lastName } = req.body;
  const {user,userType} = req.user
  console.log(user,userType)
  
  const query = `
  UPDATE users
  SET "phonenumber" = $2, "firstname" = $3, "lastname" = $4
  WHERE "id" = $1 and "type" = $5
`;


  try {

    const result = await pool.query(query, [
      user,
      phoneNumber,
      firstName,
      lastName,
      userType
    ]);

    if(result){
      res.status(200).json({ message: "User profile updated successfully" });
    }
    


  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "An error occurred while updating user profile" });
  }
});

module.exports = router;

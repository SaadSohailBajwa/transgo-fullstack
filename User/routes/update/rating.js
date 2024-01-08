const express = require("express");
const router = express.Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");

const updateRating = (inputString, numberToAdd) => {
  if(!inputString){
    return
  }
  const parts = inputString.split("-");
  const leftPart = parseInt(parts[0], 10);
  const rightPart = parseInt(parts[1], 10);

  if (!isNaN(leftPart) && !isNaN(rightPart)) {
    // Add the number to the left side
    const newLeftPart = leftPart + numberToAdd;

    // Increment the right side by 1
    const newRightPart = rightPart + 1;

    // Return the result as a formatted string
    return `${newLeftPart}-${newRightPart}`;
  } else {
    console.error("Invalid input string:", inputString);
    return null;
  }
};

// Update user profile route
router.post("/", async (req, res) => {
  console.log("got request on http://localhost:3001/user/review/");

  const { rating,driverId } = req.body;
  
 

  const getRatingQuery = `SELECT rating from users where id = $1`
  const updateRatingQuery = `UPDATE users SET rating = $1 where id = $2`


  try {
    await pool.query("BEGIN");
    const prevRating = await pool.query(getRatingQuery, [driverId
    ]);
    console.log(prevRating.rows[0].rating);
    const newRating = updateRating(prevRating.rows[0].rating,rating)

    await pool.query(updateRatingQuery,[newRating,driverId])
    console.log(newRating)

    await pool.query("COMMIT");
    if (newRating) {
      res.status(200).json({ rating:newRating });
    }
  } catch (error) {
    console.error("Error updating rating:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating user profile" });
  }
});

module.exports = router;

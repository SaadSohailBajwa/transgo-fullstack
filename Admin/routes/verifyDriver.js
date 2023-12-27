const express = require("express");
const router = express.Router();

const authorization = require("../middleware/authorization");

const pool = require("../db");

router.patch("/verify", authorization, async (req, res) => {
  try {
    console.log("got req on verify route");

    const {id,verified} = req.body
    console.log("verified: ",verified)

    const verifyDriver = await pool.query(`UPDATE drivers set verified = $1 WHERE id = $2`,[verified,id])

  } catch (err) {
    console.log("error from verify: ", err);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const authorization = require("../middleware/authorization");

const pool = require("../db");

router.get("/get/:id", async (req, res) => {
  try {
    console.log("got get a user request");
    const id = req.params.id

    if(id){
      const getUser = await pool.query(
      `SELECT * from users WHERE id = $1 `,[id]
    );
    res.status(200).json(getUser.rows);
    }

    

    console.log("query getUser: success");

    
  } catch (err) {
    console.log("error from getUser: ", err);
  }
});

module.exports = router;

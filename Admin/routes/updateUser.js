const express = require("express");
const router = express.Router();

const authorization = require("../middleware/authorization");

const pool = require("../db");

const query = `UPDATE users
SET phonenumber = $1, email = $2, firstname = $3, lastname = $4
WHERE id = $5;`;

router.put("/update/", async (req, res) => {
  try {
    console.log("got put a user request");
    const {id,phonenumber,email,firstname,lastname} = req.body

    const updateUser = await pool.query(query, [phonenumber,email,firstname,lastname,id
    ]);

    console.log("query updateUser: success");

    res.status(200).json(updateUser.rows);
  } catch (err) {
    console.log("error from updateUser: ", err);
  }
});

module.exports = router;

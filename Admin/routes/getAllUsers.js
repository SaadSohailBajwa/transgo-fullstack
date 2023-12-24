const express = require("express");
const router = express.Router();

const authorization = require("../middleware/authorization");

const pool = require("../db");

router.get("/get/all",  async (req, res) => {
  try {
    console.log("got get all users request");

    const getUsers = await pool.query(`SELECT * from users WHERE type = 'user' `);

    console.log("query getUsers: success");

    res.status(200).json(getUsers.rows);
  } catch (err) {
    console.log("error from getUsers: ", err);
  }
});

module.exports = router

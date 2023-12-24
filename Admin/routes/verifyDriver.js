const express = require("express");
const router = express.Router();

const authorization = require("../middleware/authorization");

const pool = require("../db");

router.get("/verify", authorization, async (req, res) => {
  try {
    console.log("got req on verify route");
  } catch (err) {
    console.log("error from verify: ", err);
  }
});

module.exports = router;

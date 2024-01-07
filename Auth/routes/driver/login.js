const jwtGenerator = require("../../utils/jwtGenerator");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// requiring db object from the path
const db = require("../../models/index");
const { drivers } = db;

//for login we need phonenumber + password_hash

router.post("/login", async (req, res) => {
  try {
    console.log("got login request");

    //1. destructure the req.body
    const { phonenumber, password_hash } = req.body;

    console.log(drivers);
    //2. check if user doesn't exist (throw error if not)
    const loginDriver = await drivers.findOne({
      where: { phonenumber: phonenumber },
    });

    if (!loginDriver) {
      return res.status(401).json("Phone number is incorrect");
    }

    //3. check if incoming password_hash is the same as the database password_hash
    //validPassword returns a boolean true/false
    const validPassword = await bcrypt.compare(
      password_hash,
      loginDriver.password_hash
    );

    if (!validPassword) {
      return res.status(401).json("Password or email is incorrect");
    }

    //4. give them a jwt token
    const token = jwtGenerator(loginDriver.id);

    console.log(
      `User with name ${loginDriver.firstname} has now logged in to their account`
    );

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

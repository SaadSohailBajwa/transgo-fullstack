const jwtGenerator = require("../../utils/jwtGenerator");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const validEmail = require("../../middleware/validEmail");

// requiring db object from the path
const db = require("../../models/index");
const { drivers } = db;

router.post("/register", validEmail, async (req, res) => {
  // id	            Auto
  // phonenumber	  Must
  // email	        Must
  // password_hash	      Must
  // firstname	    Must
  // lastname	      Must
  // verified	      Default (*false*)

  try {
    // destructure
    const { phonenumber, firstname, lastname, email, password_hash } = req.body;

    // Check if user exists
    const emailExist = await drivers.findOne({ where: { email: email } });

    if (emailExist) {
      return res.status(401).send("User already exists");
    }
    if (!phonenumber.trim()) {
      return res.status(400).send("Phone number is required");
    }
    if (!firstname.trim()) {
      return res.status(400).send("First name is required");
    }
    if (!lastname.trim()) {
      return res.status(400).send("First name is required");
    }
    if (!password_hash.trim()) {
      return res.status(400).send("Password is required");
    }

    // Bcrypt the user password_hash
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password_hash, salt);

    // Create a new user
    const newDriver = await drivers.create({
      phonenumber: phonenumber,
      firstname: firstname,
      lastname: lastname || "",
      email: email,
      password_hash: hashedPassword,
    });

    console.log("User registered");

    // Generate JWT token
    const token = jwtGenerator(newDriver.id);
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;

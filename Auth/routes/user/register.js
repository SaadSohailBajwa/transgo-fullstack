const jwtGenerator = require("../../utils/jwtGenerator");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const jwtRefreshGenerator = require("../../utils/jwtRefreshGenerator");
const validEmail = require("../../middleware/validEmail");

// requiring db object from the path
const db = require("../../models/index");
const { users } = db;

router.post("/register", validEmail, async (req, res) => {
  //adds a user in the database
  // id	            Auto
  // phonenumber Must
  // firstName	    Must
  // password	    Must

  // email	    Optional
  // lastName	Optional
  // latitude	Optional
  // longitude	Optional

  try {
    // destructure
    const { phoneNumber, firstName, lastName, email, password, type } =
      req.body;

    // Check if user exists
    const emailExist = await users.findOne({
      where: { email: email, type: type },
    });

    const phoneNumberExist = await users.findOne({
      where: { phonenumber: phoneNumber, type: type },
    });

    if (phoneNumberExist) {
      return res.status(401).send("phone number already in use");
    }
    if (emailExist) {
      return res.status(401).send("email already in use");
    }
    if (!phoneNumber.trim()) {
      return res.status(400).send("Phone number is required");
    }
    if (!firstName.trim()) {
      return res.status(400).send("First name is required");
    }
    if (!password.trim()) {
      return res.status(400).send("Password is required");
    }

    // Bcrypt the user password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await users.create({
      phonenumber: phoneNumber,
      firstname: firstName,
      lastname: lastName || "",
      email: email,
      password_hash: hashedPassword,
      type: type,
      rating: "0-0",
    });

    console.log(`User registered with id ${newUser.id}`);

    // Generate JWT token
    const token = jwtGenerator(newUser.id, type);
    const refreshToken = jwtRefreshGenerator(newUser.id, type);
    const id = newUser.id;
    res.json({
      token,
      firstName,
      lastName,
      email,
      phoneNumber,
      type,
      id,
      refreshToken,
    });
    console.log(token);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;

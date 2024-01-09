const jwtGenerator = require("../../utils/jwtGenerator");
const jwtRefreshGenerator = require("../../utils/jwtRefreshGenerator");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

// requiring db object from the path
const db = require("../../models/index");
const { users, drivers } = db;

//for login we need :
//phonenumber
//password_hash

router.post("/login", async (req, res) => {
  try {
    console.log("got login request");

    // 1. Destructure the req.body
    const { phoneNumber, password, type } = req.body;

    // 2. Check if the user exists in the 'users' table
    const user = await users.findOne({
      where: { phonenumber: phoneNumber, type: type },
    });

    // 3. Check if the type is 'driver'
    let verified = true;
    if (type === "driver") {
      // 4. If 'driver', check the 'verified' column in the 'drivers' table
      const driver = await drivers.findOne({
        where: { id: user.id },
      });

      if (driver) {
        verified = driver.verified;
      }
    }

    // 6. Check if the incoming hash of the password is the same as the database password_hash
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json("Password or email is incorrect");
    }

    // 7. Give them a access JWT token
    const token = jwtGenerator(user.id, type);
    // 8. Give them a refresh JWT token
    const refreshToken = jwtRefreshGenerator(user.id, type);
    console.log("refresh token generated in login route: ", refreshToken);

    const { firstname, lastname, email, id } = user;

    res.json({
      token,
      refreshToken,
      firstname,
      lastname,
      email,
      phoneNumber,
      id,
      verified,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

// try {
//   console.log("got login request");

//   //1. destructure the req.body
//   const { phoneNumber, password, type } = req.body;

//   console.log(users);
//   //2. check if user doesn't exist (throw error if not)
//   const loginUser = await users.findOne({
//     where: { phonenumber: phoneNumber, type: type },
//   });

//   if (!loginUser) {
//     return res.status(401).json("Phone number is incorrect");
//   }

//   //3. check if incoming hash of password is the same as the database password_hash
//   //validPassword returns a boolean true/false
//   const validPassword = await bcrypt.compare(password, loginUser.password_hash);

//   if (!validPassword) {
//     return res.status(401).json("Password or email is incorrect");
//   }

//   //4. give them a jwt token
//   const token = jwtGenerator(loginUser.id, type);

//   console.log(
//     `User with name ${loginUser.firstname} has now logged in to their account`
//   );

//   const { firstname, lastname, email, id } = loginUser;

//   res.json({ token, firstname, lastname, email, phoneNumber, id });
// } catch (err) {
//   console.error(err.message);
//   res.status(500).send("Server error");
// }

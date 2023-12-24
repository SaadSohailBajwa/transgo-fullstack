const express = require("express");
const router = express.Router();

const verifyDriver = require("./verifyDriver");
const getAllDrivers = require("./getAllDrivers")
const getDriver = require("./getDriver")
router.use("/driver",verifyDriver);
router.use("/driver",getAllDrivers)
router.use("/driver",getDriver)


const getAllUsers = require("./getAllUsers")
const getUser = require("./getUser")

router.use("/user",getAllUsers);
router.use("/user",getUser)

const updateUser = require("./updateUser")
router.use("/user",updateUser)



module.exports = router;
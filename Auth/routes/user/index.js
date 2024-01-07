const express = require("express");
const router = express.Router();

const loginRoutes = require("./login");
const registerRoutes = require("./register");
const validateNumber = require("./validateNumber")
const verifyToken = require("./verifyToken")

router.use("/user", loginRoutes);
router.use("/user", registerRoutes);
router.use("/user",validateNumber);
router.use("/token",verifyToken)

module.exports = router;

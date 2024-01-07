const express = require("express");
const router = express.Router();

const updateProfileRoutes = require("./updateProfile");
// const updatePasswordRoutes = require("./updatePassword");


router.use("/update", updateProfileRoutes);
//router.use("/password", updatePasswordRoutes);


module.exports = router;

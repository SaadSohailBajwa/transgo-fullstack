const express = require("express");
const router = express.Router();

const updateProfileRoutes = require("./updateProfile");
// const updatePasswordRoutes = require("./updatePassword");
const updateRating = require("./rating")

router.use("/update", updateProfileRoutes);
//router.use("/password", updatePasswordRoutes);
router.use("/rating",updateRating)


module.exports = router;

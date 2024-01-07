const express = require("express");
const router = express.Router();

const shipmentInfo = require("./shipmentInfo");


router.use("/info", shipmentInfo);


module.exports = router;

const express = require("express");
const router = express.Router();

const nearestType = require("./nearestType");

// nearest/search/type
router.use("/search", nearestType);

// nearest/search/capacity

module.exports = router;

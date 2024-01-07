const express = require("express");
const router = express.Router();
const AI = require("./ai");

const addDriverInfo = require("./addDriverInfo");
const getVerificationStatus = require("./getVerificationStatus");
const shipmentInfo = require("./shipmentInfo");
const getSignedUrl = require("./getSignedUrl");

router.use("/info", addDriverInfo);
router.use("/status", getVerificationStatus);
router.use("/info", shipmentInfo);
router.use("/aws", getSignedUrl);
router.use("/ai", async (req, res) => {
  const imageUrl = req.query.url;
  const AIText = await AI(imageUrl);
  console.log(AIText)
  res.send(AIText);
});

module.exports = router;

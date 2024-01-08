const express = require("express");
const router = express.Router();
const AI = require("./ai");

const nearestType = require("./nearestType");

// nearest/search/type
router.use("/search", nearestType);
router.use("/ai", async (req, res) => {
  const imageUrl = req.query.url;
  const AIText = await AI(imageUrl);
  console.log(AIText);
  res.send(AIText);
});

// nearest/search/capacity

module.exports = router;

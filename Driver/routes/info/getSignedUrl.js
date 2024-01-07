const express = require("express");
const router = express.Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");

const generateUploadURL = require("../../s3.js");


router.get("/get/signedurl/:type", authorization, async (req, res) => {
  
  try {
    const { user } = req.user;
    const imageType = req.params.type
    console.log("got req on aws signed url")
    const url = await generateUploadURL(user,imageType);
    res.send({url}) 
  } catch (err) {
    console.log("getSignedUrl error is: ", err);
  }
});

module.exports = router;

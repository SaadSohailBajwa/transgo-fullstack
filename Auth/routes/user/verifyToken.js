const express = require("express");
const router = express.Router();
const jwtGenerator = require("../../utils/jwtGenerator");
const jwtRefreshGenerator = require("../../utils/jwtRefreshGenerator")

const jwt = require("jsonwebtoken");
require("dotenv").config();

// requiring db object from the path
const db = require("../../models/index");
const { users,drivers } = db;

router.get('/refresh',async (req,res)=>{
    try{
        console.log("got req on refresh token route")




        const refreshToken = await req.header("refresh");

        console.log(refreshToken)

        if(!refreshToken){
            return res.status(403).json("token does not exist")
        }
        const payload = await jwt.verify(
          refreshToken,
          "86rxci5r7dcp086yt5dcvf0csxik68jBC"
        );

        const user = await users.findOne({
          where: {id: payload.user}
        })
        const { firstname, lastname, email, id,type } = user;

        if(type=="driver"){
          const driver = drivers.findOne({where: {id:payload.user}})
          const {verified} = driver
          if(verified=="false"){
            return res.status(403).json("not verified yet")
          } 
        }
        //new token if refresh token is verified
        const newAccessToken = await jwtGenerator(payload.user,payload.userType)
        const newRefreshToken = await jwtRefreshGenerator(payload.user,payload.userType)

        res.json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          mode:payload.userType,
          id,
          firstname,
          lastname,
          email
        });

        //else it goes to catch block
        //user will go to passcode login route
    }catch(err){
        console.log("error in refresh token route: ",err)
        res.status(403).json("token expired")
    }
})

module.exports = router;
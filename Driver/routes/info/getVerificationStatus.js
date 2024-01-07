const express = require("express");
const router = express.Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");

router.get('/',authorization, async (req,res)=>{
    const {id} = req.body
    try{
        const query = await pool.query(`SELECT verified FROM drivers WHERE id=$1`,[id])

        res.status(200).json(query.rows)
    }catch(err){
        console.log("getVerificationStatus error is: ",err)
    }
    
})

module.exports = router
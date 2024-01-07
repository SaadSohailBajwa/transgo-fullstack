const express = require('express');
const app = express();

// getting port from dotenv
// if not PORT available then use 3000
require("dotenv").config();
const PORT = process.env.PORT || 3000;



// cors config

const cors = require("cors");
const whitelist = [
  "http://localhost:5173",
  "http://10.0.2.2:5173",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
//allows only select
//app.use(cors(corsOptions));

//allows all
app.use(cors());





// parse options
app.use(express.json());
app.use(express.urlencoded({extended:true}))


// routes

//user
//auth/user/*function*
app.use('/auth',require('./routes/user/index'))


//driver
//auth/driver/*function*
// /app.use('/auth',require('./routes/driver/index'))  //currently not in use

//admin
//auth/admin/*function*
//app.use('./auth',require('./routes/admin/index'))



const db = require("./models/index");


const { users } = db; 
const { drivers } = db;
app.get("/all-data", async (req, res) => {
  try {
    const user = await users.findAll();
    

    return res.status(200).json({
      users: user,
      
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});





// server start:
app.listen(PORT,()=>{
    console.log('server started on port 3000')
})




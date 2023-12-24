const express = require("express")
const app = express()

require("dotenv").config();
const PORT = process.env.PORT || 3004;


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


//router
app.use('/admin',require('./routes/index'))





app.listen(PORT,()=>{
    console.log(`admin server started on port: ${PORT}`)
})
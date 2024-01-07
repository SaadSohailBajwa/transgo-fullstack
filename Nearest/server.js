const express = require("express");
const app = express();

// getting port from dotenv
// if not PORT available then use 3003
require("dotenv").config();
const PORT = process.env.PORT || 3003;

// cors config

const cors = require("cors");
const whitelist = [
  "http://localhost:5173",
  "http://10.0.2.2:5173",
  "http://192.168.100.1:5173",
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
app.use(express.urlencoded({ extended: true }));

/////////
// routes
/////////
//update
//nearest/search/*function*
app.use("/nearest", require("./routes/nearest/index"));

//
// server start:
app.listen(PORT, () => {
  console.log("server started on port 3003");
});

const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    //1. destructure token from the header i.e req.body

    /////////////////////
    //////////////////////
    //////////////// key word here is header
    ///////////////////// token is sent in header
    /////////////////////// not body !!!!!!!

    console.log("Incoming request headers:", req.headers);
    const jwtToken = await req.header("token");
    console.log("Received token:", jwtToken);


    //2. check if the token exists or not

    if (!jwtToken) {
      return res.status(403).json("not authorized");
    }

    //3. if it exist then check if the token is valid not
    console.log(jwtToken);
    //the jwt.verify decodes the token and returns it back to its original form i.e payload object with user property
    const payload = jwt.verify(jwtToken, process.env.jwtSecret);

    req.user = payload;

    next();
  } catch (err) {
    console.log(err.message);
    return res.status(403).json("not authorized");
  }
};

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

    const jwtToken = await req.header("token");

    //2. check if the token exists or not

    if (!jwtToken) {
      return res.status(403).json("not authorized");
    }

    //3. if it exist then check if the token is valid not

    //the jwt.verify decodes the token and returns it back to its original form i.e payload object with user property
    const payload = jwt.verify(jwtToken, "SOdb1nSrhx4BLIWlhOUP16RjMToWhwTC");

    req.user = payload;

    next();
  } catch (err) {
    console.error(err.message);
    return res.status(403).json("not authorized");
  }
};

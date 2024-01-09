const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id,type) {
  //object made with user_id which came from database
  const payload = {
    user: user_id,
    userType:type
  };

  //the jwt.sign encodes the payload object into a jwt token
  //it is later decoded with jwt.verify in authorization middleware

  return jwt.sign(payload, "SOdb1nSrhx4BLIWlhOUP16RjMToWhwTC", {
    expiresIn: 3600,
  });
}

module.exports = jwtGenerator;

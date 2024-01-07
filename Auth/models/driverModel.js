const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  // user table name without 's'
  const Driver = sequelize.define("driver", {
    
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },{
    timestamps: false,
  }
  );
  return Driver;
};

// id	        Auto
// phonenumber	Must
// email	    Must
// password_hash	    Must
// firstname	Must
// lastname	    Must
// verified	    Default (*false*)

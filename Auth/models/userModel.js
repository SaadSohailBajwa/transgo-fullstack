const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  // user table name without 's'
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
      },
      phonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rating:{
        type: DataTypes.STRING,
        allowNull:true
      }
    },
    {
      timestamps: false, // Add createdAt and updatedAt columns
    }
  );
  return User;
};

// id	Auto
// phonenumber	Must
// firstname	Must
// password_hash	    Must

// email	Optional
// lastname	Optional
// latitude	Optional
// longitude	Optional

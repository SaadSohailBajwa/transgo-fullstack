const dbConfig = require('../config/db-config');
const { Sequelize, DataTypes } = require("sequelize");
//const {sequelize, DataTypes, Sequelize} = require('sequelize');

const sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
    dialectOptions: {
      encrypt: true,
      ssl: true,
    },
    logging: console.log,
  }
);

// to authenticate if connection to database has been established or not

sequelize.authenticate().then(()=>{
    console.log('connected..')
}).catch(err => {
    console.log('error: ' + err)
})


const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize


// db.xyz will import from the given path
db.users = require('./userModel.js')(sequelize,DataTypes)
db.drivers = require('./driverModel.js')(sequelize,DataTypes)
// db.admin = require('./adminModel.js')(sequelize,DataTypes)




db.sequelize.sync({ force:false}).then(()=>{
    console.log('yes re-sync done!')
})

module.exports = db
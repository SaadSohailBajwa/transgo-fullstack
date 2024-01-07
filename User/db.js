const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "transgo",
  password: "5432",
  port: 5432,
});

module.exports = pool;

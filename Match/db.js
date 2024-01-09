const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "transgo-db.postgres.database.azure.com",
  database: "postgres",
  password: "Transgo1",
  port: 5432,
});

module.exports = pool;

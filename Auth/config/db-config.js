module.exports = {
  HOST: "transgo-db.postgres.database.azure.com",
  USER: "postgres",

  DATABASE: "postgres",
  PASSWORD: "Transgo1",
  PORT: 5432,
  DIALECT: "postgres",

  pool: {
    max: 10, // Max of connections in the pool.
    min: 0, // Min of idle connections in the pool.
    acquire: 30000, // Max in millisec, to try to get a connection before throwing an error.
    idle: 10000, // Max in millisec, that a connection can be idle before being released.
  },
};

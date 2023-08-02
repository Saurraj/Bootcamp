const pg = require("pg");
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "todo",
  password: "1234",
  port: 5432,
});

module.exports = pool;

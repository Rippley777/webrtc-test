const { Pool } = require("pg");
require("dotenv").config();
const logger = require("./lib/helpers/logger");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on("connect", () => {
  logger.info("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  logger.error("PostgreSQL connection error", { error: err });
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

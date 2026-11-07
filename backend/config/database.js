const { Sequelize } = require('sequelize');

const dialect = (process.env.DB_DIALECT || 'mariadb').trim();
const useSSL = String(process.env.DB_SSL).trim().toLowerCase() === 'true';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: dialect,
    logging: false,
    dialectOptions: {
      connectTimeout: 60000,
      ...(useSSL
        ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } }
        : {}),
    },
  }
)

module.exports = sequelize;

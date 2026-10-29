const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'products',
  timestamps: false,
});

module.exports = Product;
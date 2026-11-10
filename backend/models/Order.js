const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING(8),
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    shipping_name: {
      type: DataTypes.STRING,
    },
    shipping_phone: {
      type: DataTypes.STRING,
    },
    shipping_address: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  },
);

module.exports = Order;

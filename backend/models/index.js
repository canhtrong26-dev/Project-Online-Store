const Category = require('./Category');
const Product = require('./Product');
const User = require('./User');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

//khai báo quan hệ khóa chính
Category.hasMany(Product, { foreignKey: 'category_id' }); //1 category có nhiều product
Product.belongsTo(Category, { foreignKey: 'category_id' }); //1 product thuộc 1 category

User.hasMany(Order, { foreignKey: 'user_id' }); 
Order.belongsTo(User, { foreignKey: 'user_id' }); 

Order.hasMany(OrderItem, { foreignKey: 'order_id' }); 
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' }); 
OrderItem.belongsTo(Product, { foreignKey: 'product_id' }); 

module.exports = { Category, Product, User, Order, OrderItem };
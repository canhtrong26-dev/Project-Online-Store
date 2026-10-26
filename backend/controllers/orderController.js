const { Order, OrderItem, Product, User } = require('../models/index');

// Lấy tất cả order
const getAll = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User },                        // lấy kèm thông tin user
        { model: OrderItem, include: [Product] } // lấy kèm order items + product
      ]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm order mới
const create = async (req, res) => {
  try {
    const { user_id, total, items } = req.body;
    const order = await Order.create({ user_id, total });
    // Tạo từng order item
    for (const item of items) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sửa order
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Order.update({ status }, { where: { id } });
    res.json({ message: 'Cập nhật thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xoá order
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await OrderItem.destroy({ where: { order_id: id } }); 
    await Order.destroy({ where: { id } });             
    res.json({ message: 'Xoá thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAll, create, update, remove };
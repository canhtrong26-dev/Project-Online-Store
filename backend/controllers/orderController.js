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
    const { items } = req.body;        //lấy product + quantity từ checkout/page.tsx rồi tự tính ra total
    const user_id = req.user.id;  // lấy id của user từ accessToken (đã được verifyToken giải mã)

    // Kiểm tra cart không rỗng
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống!' });
    }

    // Kiểm tra quantity hợp lệ
    for (const item of items) {
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: 'Số lượng không hợp lệ!' });
      }
    }

    // BE tự tính total không tin FE
    let total = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        return res.status(400).json({ message: "Sản phẩm không tồn tại!" });
      }
      total = total + product.price * item.quantity;
    }

    // Tạo order chính
    const order = await Order.create({ user_id, total });

    // Tạo order chi tiết từ order chính ở trên
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,  // giá thật từ DB
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
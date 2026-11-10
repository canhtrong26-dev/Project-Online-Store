const { Order, OrderItem, Product, User } = require("../models/index");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

// Lấy order theo trang (phân trang): mỗi lần chỉ lấy tối đa `limit` order (mặc định 10), không lấy hết 1 lần
const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
      include: [
        { model: User, attributes: { exclude: ["password"] } }, //lấy kèm thông tin user
        { model: OrderItem, include: [Product] }, // lấy kèm order items + product
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    }); // trả về: danh sách order của trang hiện tại, tổng số order, trang hiện tại, tổng số trang
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Lấy đơn hàng của user đang login
const getMyOrders = async (req, res) => {
  try {
    const user_id = req.user.id; // lấy từ token
    const orders = await Order.findAll({
      where: { user_id }, //chỉ lấy đơn của user này
      include: [
        { model: OrderItem, include: [Product] }, // kèm chi tiết sản phẩm
      ],
      order: [["createdAt", "DESC"]], // mới nhất lên trên
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm order mới
const create = async (req, res) => {
  try {
    const { items, name, phone, address } = req.body;
    const user_id = req.user.id;

    // Kiểm tra cart không rỗng
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống!" });
    }

    // Kiểm tra thông tin giao hàng
    if (!name || !phone || !address) {
      return res.status(400).json({ message: "Thiếu thông tin giao hàng!" });
    }

    // Kiểm tra quantity hợp lệ
    for (const item of items) {
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: "Số lượng không hợp lệ!" });
      }
    }

    // BE tự tính total không tin FE + kiểm tra đủ hàng
    let total = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        return res.status(400).json({ message: "Sản phẩm không tồn tại!" });
      }
      // kiểm tra đủ hàng trong kho không
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}" chỉ còn ${product.stock} trong kho!`,
        });
      }
      total = total + product.price * item.quantity;
    }

    // Sđt đã có trong DB thì cập nhật khách đó, chưa có thì ghi vào tài khoản đang đăng nhập
    const khachTheoSdt = await User.findOne({ where: { phone } });
    let idKhach;
    if (khachTheoSdt) {
      await User.update({ name, address }, { where: { id: khachTheoSdt.id } });
      idKhach = khachTheoSdt.id;
    } else {
      await User.update({ name, phone, address }, { where: { id: user_id } });
      idKhach = user_id;
    }

    
    const t = await sequelize.transaction(); //Mở transaction: tạo đơn, chi tiết đơn và trừ kho phải cùng thành công hoặc cùng huỷ
    try {
      // Tạo order chính (lưu luôn thông tin giao hàng lúc đặt - snapshot)
      const order = await Order.create(
        {
          user_id: idKhach,
          total,
          shipping_name: name,
          shipping_phone: phone,
          shipping_address: address,
        },
        { transaction: t },
      );

      // Tạo order chi tiết + trừ kho cho từng sản phẩm
      for (const item of items) {
        const product = await Product.findByPk(item.product_id);
        await OrderItem.create(
          {
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: product.price, // giá thật từ DB
          },
          { transaction: t },
        );

        //gộp lại phần kiểm tra stock và trừ đơn hàng vào 1 lệnh  [affected] chống 2 người cùng đặt 1 đơn hàng mà kho chỉ còn 1 cái, nếu 1 người trừ kho thành công thì người kia sẽ bị lỗi affected = 0
        const [affected] = await Product.update( 
          { stock: sequelize.literal(`stock - ${item.quantity}`) }, //SET stock = stock - số lượng (dùng literal để DB tự tính trên giá trị mới nhất, không lấy số cũ từ code)
          {
            where: {
              id: item.product_id, //trừ cho đúng id này
              stock: { [Op.gte]: item.quantity }, // stock >= item.quantity (lệnh thô của db đc tạo từ literal)
            },
            transaction: t, //ok thì đi tiếp xuống phần await t.commit() bên dưới để chốt ghi nhận dữ liệu mới thật sự
          },
        );
        if (affected === 0) { 
          await t.rollback();
          return res.status(400).json({
            message: `Sản phẩm "${product.name}" vừa hết hàng!`,
          });
        }
      }
      await t.commit(); // mọi thứ ok thì chốt transaction, dữ liệu mới thật sự được ghi
      res.status(201).json(order);

    } catch (loiTransaction) {
      // Có lỗi giữa chừng thì huỷ sạch: đơn, chi tiết, và trừ kho đều không được ghi
      await t.rollback();
      res.status(500).json({ message: "Đặt hàng thất bại, vui lòng thử lại!" });
    }
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
    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xoá order
const remove = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    // lấy chi tiết đơn để biết trả lại bao nhiêu hàng vào kho
    const chiTiet = await OrderItem.findAll({
      where: { order_id: id },
      transaction: t,
    });

    // cộng lại kho cho từng sản phẩm (hoàn hàng khi huỷ đơn)
    for (const item of chiTiet) {
      const product = await Product.findByPk(item.product_id, {
        transaction: t,
      });
      if (product) {
        await Product.update(
          { stock: product.stock + item.quantity },
          { where: { id: item.product_id }, transaction: t },
        );
      }
    }

    // xoá chi tiết đơn rồi xoá đơn
    await OrderItem.destroy({ where: { order_id: id }, transaction: t });
    await Order.destroy({ where: { id }, transaction: t });

    await t.commit();
    res.json({ message: "Xoá thành công!" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAll, create, update, remove, getMyOrders };

const bcrypt = require("bcryptjs"); //dùng để băm mật khẩu khi admin tạo user
const { User, Order } = require('../models/index');
const { sendError } = require("../utils/errors");

// Lấy tất cả user
const getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

// Thêm user mới
const create = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); //băm mật khẩu như lúc đăng ký, không lưu mật khẩu thô vào DB
    const user = await User.create({ name, email, password: hashedPassword, phone, address, role });
    const data = user.toJSON();
    delete data.password; //không trả cột password ra ngoài API
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

// Sửa user
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    await User.update({ name, email, phone, address }, { where: { id } });
    res.json({ message: 'Cập nhật thành công!' });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

// Xoá user, chặn nếu khách đã có đơn hàng
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return sendError(res, 404, "USER_NOT_FOUND");
    }

    const soDonHang = await Order.count({ where: { user_id: id } });
    if (soDonHang > 0) {
      return sendError(res, 400, "USER_HAS_ORDERS", {
        message: `Không xoá được! Khách hàng này đang có ${soDonHang} đơn hàng.`,
        count: soDonHang,
      });
    }

    await User.destroy({ where: { id } });
    res.json({ message: 'Xoá thành công!' });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

module.exports = { getAll, create, update, remove };
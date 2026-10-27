const { User } = require('../models/index');

// Lấy tất cả user
const getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm user mới
const create = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;
    const user = await User.create({ name, email, password, phone, address, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

// Xoá user
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.json({ message: 'Xoá thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAll, create, update, remove };
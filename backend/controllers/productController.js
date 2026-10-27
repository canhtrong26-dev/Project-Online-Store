const { Product, Category } = require('../models/index');

// Lấy tất cả sản phẩm
const getAll = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: Category,   
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm sản phẩm mới
const create = async (req, res) => {
  try {
    const { name, price, image_url, description, category_id } = req.body;
    const product = await Product.create({ name, price, image_url, description, category_id });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sửa sản phẩm
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image_url, description, category_id } = req.body;
    await Product.update({ name, price, image_url, description, category_id }, { where: { id } });
    res.json({ message: 'Cập nhật thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xoá sản phẩm
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.destroy({ where: { id } });
    res.json({ message: 'Xoá thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAll, create, update, remove };

const { Op } = require("sequelize");
const { Product, Category } = require("../models/index");

// Lấy danh sách sản phẩm: phân trang, lọc theo danh mục, tìm theo tên
const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.category_id) {
      where.category_id = req.query.category_id;
    }
    if (req.query.search) {
      where.name = { [Op.like]: `%${req.query.search}%` };
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: Category,
      order: [["updatedAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm sản phẩm mới
const create = async (req, res) => {
  try {
    const { name, price, image_url, description, category_id } = req.body;
    const product = await Product.create({
      name,
      price,
      image_url,
      description,
      category_id,
    });
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
    await Product.update(
      { name, price, image_url, description, category_id },
      { where: { id } },
    );
    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xoá sản phẩm
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.destroy({ where: { id } });
    res.json({ message: "Xoá thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm theo id
const getOne = async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [{ model: Category }],
  });
  if (!product) return res.status(404).json({ message: "Không tìm thấy!" });
  res.json(product);
};

module.exports = { getAll, getOne, create, update, remove };

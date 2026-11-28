const { Category, Product } = require("../models/index");
const { sendError } = require("../utils/errors");
//get tất cả danh mục
const getAll = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

//tạo mới 1 danh mục
const create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

//update 1 danh mục
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await Category.update({ name }, { where: { id } });
    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

//xoá 1 danh mục, chặn nếu còn sản phẩm thuộc danh mục này
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return sendError(res, 404, "CATEGORY_NOT_FOUND");
    }

    const soSanPham = await Product.count({ where: { category_id: id } });
    if (soSanPham > 0) {
      return sendError(res, 400, "CATEGORY_HAS_PRODUCTS", {
        message: `Không xoá được! Danh mục này đang có ${soSanPham} sản phẩm.`,
        count: soSanPham,
      });
    }

    await Category.destroy({ where: { id } });
    res.json({ message: "Xoá thành công!" });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

module.exports = { getAll, create, update, remove };

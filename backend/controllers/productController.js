const { Op } = require("sequelize");
const { Product, Category, OrderItem } = require("../models/index");
const { sendError } = require("../utils/errors");
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
      where.name = { [Op.like]: `%${req.query.search}%` }; // tìm tên chứa từ khoá (LIKE); an toàn vì Sequelize tự escape giá trị, chống SQL injection
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
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

const create = async (req, res) => {
  try {
    const { name, price, image_url, description, category_id, stock } =
      req.body;
    const product = await Product.create({
      name,
      price,
      image_url,
      description,
      category_id,
      stock, // số hàng tồn kho
    });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image_url, description, category_id, stock } =
      req.body;
    await Product.update(
      { name, price, image_url, description, category_id, stock },
      { where: { id } },
    );
    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

// Xoá sản phẩm, chặn nếu sản phẩm đã nằm trong đơn hàng
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return sendError(res, 404, "PRODUCT_NOT_FOUND");
    }

    const soDonHang = await OrderItem.count({ where: { product_id: id } }); //nếu ai đã đặt thì không thể xóa vì xóa sẽ mất thông tin đã mua của user
    if (soDonHang > 0) {
      return sendError(res, 400, "PRODUCT_IN_ORDERS", {
        message: `Không xoá được! Sản phẩm này đang nằm trong ${soDonHang} đơn hàng.`,
        count: soDonHang,
      });
    }

    await Product.destroy({ where: { id } });
    res.json({ message: "Xoá thành công!" });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

// Lấy sản phẩm theo id
const getOne = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }],
    });
    if (!product) return sendError(res, 404, "PRODUCT_NOT_FOUND");
    res.json(product);
  } catch (error) {
    //phải thêm catch vì nếu DB lỗi thì Express trả về một trang lỗi HTML xấu thay vì JSON
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

module.exports = { getAll, getOne, create, update, remove };

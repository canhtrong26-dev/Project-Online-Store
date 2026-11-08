const { Category, Product } = require('../models/index');
//get tất cả danh mục
const getAll = async (req, res) => {              
  try {
    const categories = await Category.findAll(); 
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//tạo mới 1 danh mục
const create = async (req, res) => {              
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update 1 danh mục
const update = async (req, res) => {              
  try {
    const { id } = req.params;
    const { name } = req.body;
    await Category.update({ name }, { where: { id } });  
    res.json({ message: 'Cập nhật thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//xoá 1 danh mục, chặn nếu còn sản phẩm thuộc danh mục này
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục!' });
    }

    const soSanPham = await Product.count({ where: { category_id: id } });
    if (soSanPham > 0) {
      return res.status(400).json({
        message: `Không xoá được! Danh mục này đang có ${soSanPham} sản phẩm.`,
      });
    }

    await Category.destroy({ where: { id } });
    res.json({ message: 'Xoá thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAll, create, update, remove };
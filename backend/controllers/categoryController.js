const { Category } = require('../models/index');  

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

//xoá 1 danh mục
const remove = async (req, res) => {              
  try {
    const { id } = req.params;
    await Category.destroy({ where: { id } });   
    res.json({ message: 'Xoá thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAll, create, update, remove };
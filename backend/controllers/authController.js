const bcrypt = require('bcryptjs');          
const jwt = require('jsonwebtoken');         
const { User } = require('../models/index');

// Đăng ký
const register = async (req, res) => {      
  try {
    const { name, email, password, phone, address } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } }); 
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại!' });
    }

    //băm password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = await User.create({
      name, email,
      password: hashedPassword,
      phone, address,
      role: 'customer'
    });

    res.status(201).json({ message: 'Đăng ký thành công!', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Đăng nhập
const login = async (req, res) => {          
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại!' });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) {
      return res.status(400).json({ message: 'Sai mật khẩu!' });
    }

    // sau khi đáp ứng đủ cấc bước trên thì tạo token
    const token = jwt.sign(              
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Đăng nhập thành công!', token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
const bcrypt = require('bcryptjs');          
const jwt = require('jsonwebtoken');         
const { User } = require('../models/index');

const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = '7d';

//// Đăng ký
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

    // sau khi đáp ứng đủ cấc bước trên thì tạo accessToken
    const accessToken  = jwt.sign(              
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    //rồi đến refreshToken 
      const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );
    
      // Lưu refresh token vào DB
      await User.update(
        { refresh_token: refreshToken },
        { where: { id: user.id } }
      );

    res.json({ message: 'Đăng nhập thành công!', accessToken, refreshToken, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Không có refresh token!' });
    }

    // Tìm user có refresh token này
    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) {
      return res.status(401).json({ message: 'Refresh token không hợp lệ!' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Refresh token không hợp lệ!' });
      }
      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


     const logout = async (req, res) => {
      try {
        const { id } = req.user;  //lấy từ middleware
        await User.update({ refresh_token: null }, { where: { id } });
        res.json({ message: 'Đăng xuất thành công!' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };


module.exports = { register, login, refreshAccessToken, logout };

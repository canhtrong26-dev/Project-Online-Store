const jwt = require('jsonwebtoken');  

const verifyToken = (req, res, next) => {  
  const authHeader = req.headers['authorization'];  // CÓ SẴN — đọc header từ fe gửi về
  const token = authHeader && authHeader.split(' ')[1]; // lấy phần sau "Bearer "

  if (!token) {
    return res.status(401).json({ message: 'Chưa đăng nhập!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {  //(err, decoded) :err là lỗi , decod là dữ liệu giải mã cố định
    if (err) {
      return res.status(401).json({ message: 'Token không hợp lệ!' });
    }
    req.user = decoded;  
    next();              
  });
};

//kiểm tra quyền admin
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập!' });
    }
    next();
  });
};

module.exports = { verifyToken, verifyAdmin };
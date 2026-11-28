const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/errors");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // CÓ SẴN — đọc header từ fe gửi về
  const token = authHeader && authHeader.split(" ")[1]; // lấy phần sau "Bearer "

  if (!token) {
    return sendError(res, 401, "NOT_LOGGED_IN");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    //(err, decoded) :err là lỗi , decod là dữ liệu giải mã cố định
    if (err) {
      return sendError(res, 401, "INVALID_TOKEN");
    }
    req.user = decoded;
    next();
  });
};

//kiểm tra quyền admin
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "admin") {
      return sendError(res, 403, "FORBIDDEN");
    }
    next();
  });
};

module.exports = { verifyToken, verifyAdmin };

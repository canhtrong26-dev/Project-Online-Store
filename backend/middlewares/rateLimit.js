const { rateLimit } = require("express-rate-limit");
const { sendError } = require("../utils/errors");

// chặn dò mật khẩu: 1 IP chỉ được đăng nhập SAI tối đa 5 lần trong 15 phút
const loginLimiter = rateLimit({

  windowMs: 15 * 60 * 1000, // khoảng thời gian tính: 15 phút (đổi ra mili giây)
  limit: 5,                 // tối đa 5 lần
  skipSuccessfulRequests: true, // đăng nhập ĐÚNG thì không bị tính
  standardHeaders: "draft-8",   // gửi kèm header RateLimit cho biết còn bao nhiêu lượt
  legacyHeaders: false,         // tắt kiểu header cũ X-RateLimit-*
  handler: (req, res) => sendError(res, 429, "TOO_MANY_ATTEMPTS"), // quá giới hạn thì trả lỗi theo khuôn chung
});

module.exports = { loginLimiter };
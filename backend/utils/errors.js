// Bảng mã lỗi dùng chung: mã (cố định, cho code đọc) → câu tiếng Việt mặc định (cho người đọc)
const ERRORS = {
  // chung
  VALIDATION_ERROR: "Dữ liệu không hợp lệ!",
  SERVER_ERROR: "Lỗi máy chủ, vui lòng thử lại sau!",

  // đăng nhập, phân quyền
  NOT_LOGGED_IN: "Chưa đăng nhập!",
  INVALID_TOKEN: "Token không hợp lệ!",
  FORBIDDEN: "Không có quyền truy cập!",
  EMAIL_EXISTS: "Email đã tồn tại!",
  PHONE_EXISTS: "Số điện thoại đã tồn tại!",
  TURNSTILE_FAILED: "Xác minh không thành công, vui lòng thử lại!",
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng!",
  NO_REFRESH_TOKEN: "Không có refresh token!",
  INVALID_REFRESH_TOKEN: "Refresh token không hợp lệ!",
  TOO_MANY_ATTEMPTS: "Bạn đã thử sai quá nhiều lần, vui lòng thử lại sau 15 phút!",

  // sản phẩm, danh mục, khách hàng
  PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm!",
  PRODUCT_IN_ORDERS: "Không xoá được! Sản phẩm này đang nằm trong đơn hàng.",
  CATEGORY_NOT_FOUND: "Không tìm thấy danh mục!",
  CATEGORY_HAS_PRODUCTS: "Không xoá được! Danh mục này đang có sản phẩm.",
  USER_NOT_FOUND: "Không tìm thấy khách hàng!",
  USER_HAS_ORDERS: "Không xoá được! Khách hàng này đang có đơn hàng.",
  NO_IMAGE: "Chưa chọn ảnh hoặc file không phải ảnh!",

  // đơn hàng
  CART_EMPTY: "Giỏ hàng trống!",
  MISSING_SHIPPING_INFO: "Thiếu thông tin giao hàng!",
  INVALID_QUANTITY: "Số lượng không hợp lệ!",
  OUT_OF_STOCK: "Sản phẩm không đủ hàng!",
  ORDER_FAILED: "Đặt hàng thất bại, vui lòng thử lại!",
  INVALID_STATUS: "Trạng thái không hợp lệ!",
};

// Trả lỗi theo đúng 1 khuôn: { code, message, ...thông tin thêm }
const sendError = (res, status, code, extra = {}) => {
  return res.status(status).json({ code, message: ERRORS[code], ...extra });
};

module.exports = { ERRORS, sendError };
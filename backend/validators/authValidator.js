const { z } = require("zod");

// luật cho dữ liệu đăng ký
const registerSchema = z.object({
  name: z.string().trim().min(2, "Tên tối thiểu 2 ký tự").max(100, "Tên tối đa 100 ký tự"),
  email: z.email("Email không hợp lệ").max(100, "Email tối đa 100 ký tự"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").max(72, "Mật khẩu tối đa 72 ký tự"),
  phone: z.string().trim().regex(/^0\d{9}$/, "Số điện thoại phải gồm 10 số và bắt đầu bằng 0"),
  address: z.string().trim().min(5, "Địa chỉ tối thiểu 5 ký tự").max(255, "Địa chỉ tối đa 255 ký tự"),
});


// luật cho dữ liệu đăng nhập
const loginSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  turnstileToken: z.string().optional(),
});


module.exports = { registerSchema ,loginSchema};
const { z } = require("zod");
const { sendError } = require("../utils/errors");
z.config(z.locales.vi()); // câu báo lỗi mặc định của zod chuyển sang tiếng Việt

// nhận vào 1 schema, trả về 1 middleware dùng schema đó để kiểm tra req.body
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body); // kiểm tra req.body có hợp lệ với schema không

  if (!result.success) {
     return sendError(res, 400, "VALIDATION_ERROR", {
      errors: z.flattenError(result.error).fieldErrors, // lấy ra các lỗi của mỗi trường
    });
  }
  req.body = result.data; // dữ liệu đã được zod làm sạch (cắt khoảng trắng, đổi kiểu...)
  next();
};

module.exports = validate;
const cloudinary = require('../config/cloudinary');
const { sendError } = require("../utils/errors");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, "NO_IMAGE");
    }

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;//đóng gói ảnh thành chuỗi để gửi được

    const result = await cloudinary.uploader.upload(base64, { folder: 'online-store' }); //nhận về result gửi chuỗi đó sang cloudinary để lưu ảnh và nhận về result chứa url ảnh

    res.json({ url: result.secure_url }); // trả link đó cho fe (admin) để lưu vào db
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

module.exports = { uploadImage };
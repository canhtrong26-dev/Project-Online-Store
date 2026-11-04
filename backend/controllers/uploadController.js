const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Chưa chọn ảnh hoặc file không phải ảnh!' });
    }

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;//đóng gói ảnh thành chuỗi để gửi được

    const result = await cloudinary.uploader.upload(base64, { folder: 'online-store' }); //nhận về result gửi chuỗi đó sang cloudinary để lưu ảnh và nhận về result chứa url ảnh

    res.json({ url: result.secure_url }); // trả link đó cho fe (admin) để lưu vào db
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadImage };
//upload ảnh trong backend/seed-images/ lên Cloudinary, lưu kết quả vào scripts/uploaded-images.json
//chạy: node scripts/upload-images.js   (đứng trong thư mục backend)
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const cloudinary = require('../config/cloudinary');
const { products } = require('./seed-data');

const IMAGE_DIR = path.join(__dirname, '..', 'seed-images');
const OUTPUT = path.join(__dirname, 'uploaded-images.json');
const FOLDER = 'online-store/products';

//"Áo blazer đen dáng oversize" -> "ao-blazer-den-dang-oversize"
const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const main = async () => {
  //không có thư mục ảnh hoặc thư mục rỗng -> dừng, không làm gì thêm
  if (!fs.existsSync(IMAGE_DIR)) throw new Error(`Khong tim thay thu muc ${IMAGE_DIR}`);
  const files = fs.readdirSync(IMAGE_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  if (files.length === 0) throw new Error(`Thu muc ${IMAGE_DIR} khong co anh nao`);

  await cloudinary.api.ping(); //kiểm tra kết nối/khóa Cloudinary trước khi upload

  const result = {};
  for (const item of products) {
    if (!files.includes(item.file)) throw new Error(`Thieu file anh: ${item.file}`);
    const publicId = slugify(item.name);
    const res = await cloudinary.uploader.upload(path.join(IMAGE_DIR, item.file), {
      folder: FOLDER,
      public_id: publicId,
      overwrite: true, //chạy lại thì ghi đè đúng ảnh cũ, không sinh ảnh trùng
      transformation: [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto' }], //thu nhỏ ảnh gốc quá to
    });
    result[item.file] = { public_id: res.public_id, url: res.secure_url };
    console.log(`OK  ${item.file} -> ${res.secure_url}`);
  }

  const skipped = files.filter((f) => !products.some((p) => p.file === f));
  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`\nUpload thanh cong ${Object.keys(result).length}/${files.length} anh. Bo qua: ${skipped.length ? skipped.join(', ') : 'khong co'}`);
  console.log(`Da luu ket qua vao: ${OUTPUT}`);
};

main().catch((err) => {
  console.error('LOI:', err.message || err.error?.message || err);
  process.exitCode = 1;
});

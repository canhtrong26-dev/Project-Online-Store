//kiểm tra bảng products sau khi seed (chỉ đọc, không sửa gì)
//chạy: node scripts/check-products.js   (đứng trong thư mục backend)
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

const main = async () => {
  await sequelize.authenticate();

  const rows = await sequelize.query(
    `SELECT p.id, p.name, p.price, c.name AS category, p.stock, p.image_url
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     ORDER BY p.id`,
    { type: QueryTypes.SELECT },
  );
  console.table(rows.map((r) => ({ ...r, price: Number(r.price).toLocaleString('vi-VN') })));

  //ảnh rỗng hoặc không nằm trên Cloudinary
  const badImages = rows.filter((r) => !r.image_url || !r.image_url.startsWith('https://res.cloudinary.com/'));
  console.log(badImages.length === 0
    ? 'OK: tat ca san pham deu co anh tren res.cloudinary.com'
    : `CANH BAO: ${badImages.length} san pham co anh rong/khong phai Cloudinary: id ${badImages.map((r) => r.id).join(', ')}`);

  //danh mục nào chưa có sản phẩm
  const counts = await sequelize.query(
    `SELECT c.name, COUNT(p.id) AS so_san_pham
     FROM categories c LEFT JOIN products p ON p.category_id = c.id
     GROUP BY c.id, c.name ORDER BY c.id`,
    { type: QueryTypes.SELECT },
  );
  console.table(counts.map((c) => ({ ...c, so_san_pham: Number(c.so_san_pham) })));
  const empty = counts.filter((c) => Number(c.so_san_pham) === 0);
  console.log(empty.length === 0
    ? 'OK: ca 5 danh muc deu co it nhat 1 san pham'
    : `CANH BAO: danh muc trong: ${empty.map((c) => c.name).join(', ')}`);
};

main()
  .catch((err) => {
    console.error('LOI:', err.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());

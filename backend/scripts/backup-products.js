//sao lưu toàn bộ bảng products ra file JSON (không cần mysqldump)
//chạy: node scripts/backup-products.js   (đứng trong thư mục backend)
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

const main = async () => {
  console.log(`DB: ${process.env.DB_DIALECT} @ ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  await sequelize.authenticate();

  //phải truyền type SELECT, nếu không driver mariadb báo lỗi "Cannot delete property 'meta'"
  const rows = await sequelize.query('SELECT * FROM products ORDER BY id', { type: QueryTypes.SELECT });

  //tên file theo ngày-giờ, vd backup-products-2026-11-12_14-30-05.json
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const file = path.join(__dirname, `backup-products-${stamp}.json`);

  fs.writeFileSync(file, JSON.stringify(rows, null, 2), 'utf-8');
  console.log(`Da sao luu ${rows.length} san pham vao: ${file}`);
};

main()
  .catch((err) => {
    console.error('LOI:', err.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());

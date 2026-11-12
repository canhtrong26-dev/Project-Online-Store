//thay dữ liệu sản phẩm test bằng dữ liệu demo (cần chạy upload-images.js trước)
//chạy: node scripts/seed-products.js   (đứng trong thư mục backend)
//- sửa đè lên sản phẩm cũ theo id tăng dần, giữ nguyên id
//- thiếu thì tạo thêm; dư thì xóa nếu chưa có đơn, đã có đơn thì giữ lại và sửa cho tử tế
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const sequelize = require('../config/database');
const { Category, Product, OrderItem } = require('../models');
const { products, extras } = require('./seed-data');

const UPLOADED = path.join(__dirname, 'uploaded-images.json');

const main = async () => {
  if (!fs.existsSync(UPLOADED)) throw new Error('Chua co uploaded-images.json, hay chay upload-images.js truoc');
  const uploaded = JSON.parse(fs.readFileSync(UPLOADED, 'utf-8'));

  console.log(`DB: ${process.env.DB_DIALECT} @ ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  await sequelize.authenticate();

  //tra id danh mục theo TÊN, không hardcode số
  const categories = await Category.findAll({ raw: true });
  const categoryId = (name) => {
    const found = categories.find((c) => c.name === name);
    if (!found) throw new Error(`Khong tim thay danh muc "${name}" trong bang categories`);
    return found.id;
  };

  //đổi 1 dòng trong seed-data thành các field của bảng products
  const toFields = (item) => {
    const image = uploaded[item.file];
    if (!image) throw new Error(`Anh ${item.file} chua duoc upload`);
    return {
      name: item.name,
      price: item.price,
      image_url: image.url,
      description: item.description,
      category_id: categoryId(item.category),
      stock: item.stock,
    };
  };

  const report = { updated: [], created: [], deleted: [], kept: [] };

  await sequelize.transaction(async (transaction) => {
    const existing = await Product.findAll({ order: [['id', 'ASC']], raw: true, transaction });

    //1. sửa đè theo thứ tự id tăng dần
    for (let i = 0; i < Math.min(existing.length, products.length); i++) {
      await Product.update(toFields(products[i]), { where: { id: existing[i].id }, transaction });
      report.updated.push(existing[i].id);
    }

    //2. DB ít sản phẩm hơn số ảnh -> tạo thêm
    for (let i = existing.length; i < products.length; i++) {
      const created = await Product.create(toFields(products[i]), { transaction });
      report.created.push(created.id);
    }

    //3. DB nhiều hơn -> xử lý phần dư
    let extraIndex = 0;
    for (const product of existing.slice(products.length)) {
      const orderCount = await OrderItem.count({ where: { product_id: product.id }, transaction });
      if (orderCount === 0) {
        await Product.destroy({ where: { id: product.id }, transaction });
        report.deleted.push(`${product.id} (${product.name})`);
      } else {
        //đã có đơn -> không xóa, đổi thành 1 sản phẩm tử tế dùng lại ảnh đã upload
        const item = extras[extraIndex % extras.length];
        extraIndex++;
        await Product.update(toFields(item), { where: { id: product.id }, transaction });
        report.kept.push(`${product.id} ("${product.name}" -> "${item.name}", ${orderCount} dong trong order_items)`);
      }
    }
  });

  console.log(`\nDa sua: ${report.updated.length} (id ${report.updated.join(', ') || '-'})`);
  console.log(`Tao moi: ${report.created.length} (id ${report.created.join(', ') || '-'})`);
  console.log(`Da xoa (chua co don): ${report.deleted.length}${report.deleted.length ? '\n  - ' + report.deleted.join('\n  - ') : ''}`);
  console.log(`Giu lai vi da co don: ${report.kept.length}${report.kept.length ? '\n  - ' + report.kept.join('\n  - ') : ''}`);
};

main()
  .catch((err) => {
    console.error('LOI:', err.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());

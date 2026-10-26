const sequelize = require('./config/database');  
require('./models/index');                      

async function main() {
  try {
    await sequelize.authenticate();           
    console.log('Kết nối DB thành công!');

    await sequelize.sync({ force: false });     
    console.log('Tạo bảng xong!');
  } catch (error) {
    console.error('Lỗi:', error.message);
  }
}

main(); 
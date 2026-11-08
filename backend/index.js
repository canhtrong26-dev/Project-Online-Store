const { Op } = require('sequelize');
const app = require('./app');
const sequelize = require('./config/database');
const { Session } = require('./models/index');

const PORT = process.env.PORT || 5000;

//xoá các phiên đăng nhập đã hết hạn
const cleanupExpiredSessions = async () => {
  await Session.destroy({
    where: {
      expires_at: { [Op.lt]: new Date() },
    },
  });
};

//chạy mỗi 24 giờ
setInterval(cleanupExpiredSessions, 24 * 60 * 60 * 1000);

//mở cổng NGAY, không chờ database
app.listen(PORT, () => {
  console.log(`Server đang chạy ở cổng ${PORT}`);
});

//nối database song song, xong lúc nào báo lúc đó
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Đã kết nối database thành công');
  })
  .catch((error) => {
    console.error('Không kết nối được database:', error.message);
  });
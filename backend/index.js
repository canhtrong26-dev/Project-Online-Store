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

sequelize
  .sync({ force: false })
  .catch((error) => {
    console.error('Không kết nối được database:', error.message);
  })
  .finally(() => {
    app.listen(PORT, () => {});
  });

const express = require('express'); 
const cors = require('cors'); 
require('dotenv').config();
const sequelize = require('./config/database');
require('./models/index');

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); 

const { Op, Sequelize } = require('sequelize');       
const { Session } = require('./models/index'); 


const cleanupExpiredSessions = async () => {
  const deleted = await Session.destroy({
    where: {
      expires_at: { [Op.lt]: new Date() } 
    }
  });
};

//chạy mỗi 24 giờ
setInterval(cleanupExpiredSessions, 24 * 60 * 60 * 1000);

const app = express();                     
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({ origin: allowedOrigins }))
app.use(express.json());                   

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {             
  res.json({ message: 'Server đang chạy!' });
});

// Route tạm để chẩn đoán kết nối database, xoá sau khi deploy xong
app.get('/api/dbtest', async (req, res) => {
  const dialect = (req.query.driver || process.env.DB_DIALECT || 'mariadb').trim();
  const useSSL =
    String(req.query.ssl ?? process.env.DB_SSL).trim().toLowerCase() === 'true';

  const test = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: dialect,
      logging: false,
      dialectOptions: {
        connectTimeout: 20000,
        ...(useSSL
          ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } }
          : {}),
      },
    }
  );

  try {
    await test.authenticate();
    const [rows] = await test.query('SELECT COUNT(*) AS n FROM products');
    res.json({ ok: true, dialect, ssl: useSSL, soSanPham: rows[0].n });
  } catch (error) {
    res.json({
      ok: false,
      dialect,
      ssl: useSSL,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      code: (error.parent && error.parent.code) || error.name,
      message: error.message,
    });
  } finally {
    test.close().catch(() => {});
  }
});

sequelize
  .sync({ force: false })
  .catch((error) => {
    console.error('Không kết nối được database:', error.message);
  })
  .finally(() => {
    app.listen(PORT, () => {});
  });

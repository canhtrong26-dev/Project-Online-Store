const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./models/index');


//nạp thư viện cookie-parser: đọc cookie từ request thành object req.cookies
const cookieParser = require('cookie-parser');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

//danh sách tên miền được phép gọi API
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({ origin: allowedOrigins, credentials: true })); //bật CORS: chỉ cho các tên miền trong allowedOrigins gọi API, credentials: true cho phép gửi kèm cookie

app.use(express.json());

app.use(cookieParser()); //bật cookie-parser cho toàn app: mọi request đều đọc được cookie qua req.cookies


app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server đang chạy!' });
});

module.exports = app;

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


const app = express();                     
const PORT = process.env.PORT || 5000;

app.use(cors());                           
app.use(express.json());                   

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {             
  res.json({ message: 'Server đang chạy!' });
});

sequelize.sync({ force: false }).then(() => {  
  console.log('Kết nối DB thành công!');
  app.listen(PORT, () => {                       
    console.log(`Server chạy tại http://localhost:${PORT}`);
  });
});
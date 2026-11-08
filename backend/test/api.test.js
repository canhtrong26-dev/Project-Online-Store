const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('API Sản phẩm', () => {
  it('GET /api/products trả về mã 200', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).to.equal(200);
  });

  it('GET /api/products trả về đủ data, total, page, totalPages', async () => {
    const res = await request(app).get('/api/products');
    expect(res.body).to.have.property('data');
    expect(res.body).to.have.property('total');
    expect(res.body).to.have.property('page');
    expect(res.body).to.have.property('totalPages');
    expect(res.body.data).to.be.an('array');
  });

  it('GET /api/products?limit=3 trả về tối đa 3 sản phẩm', async () => {
    const res = await request(app).get('/api/products?limit=3');
    expect(res.body.data.length).to.be.at.most(3);
  });

  it('GET /api/products?page=2 trả về đúng số trang đang xem', async () => {
    const res = await request(app).get('/api/products?page=2&limit=5');
    expect(res.body.page).to.equal(2);
  });

  it('GET /api/products có search chỉ trả sản phẩm khớp tên', async () => {
    const res = await request(app).get('/api/products').query({ search: 'snapback' });
    res.body.data.forEach((sanPham) => {
      expect(sanPham.name.toLowerCase()).to.include('snapback');
    });
  });

  it('GET /api/products/999999 trả về mã 404', async () => {
    const res = await request(app).get('/api/products/999999');
    expect(res.status).to.equal(404);
  });

  it('POST /api/products khi chưa đăng nhập trả về mã 401', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'San pham test', price: 1000 });
    expect(res.status).to.equal(401);
  });
});

describe('API Danh mục', () => {
  it('GET /api/categories trả về một mảng', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});

describe('API Đăng nhập', () => {
  it('POST /api/auth/login sai mật khẩu trả về mã 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@gmail.com', password: 'mat-khau-sai-de-test' });
    expect(res.status).to.equal(400);
  });
});

const request = require('supertest');
const app = require('../index');

describe('Categories API', () => {
  it('should create a new category', async () => {
    const res = await request(app)
      .post('/categories/new-category')
      .send({ name: 'Тест', type: 'INCOME' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Тест');
  });

  it('should return all categories', async () => {
    const res = await request(app).get('/categories');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

afterAll(async () => {
  await require('../db').close(); 
});

const request = require('supertest');
const app = require('../index');
const User = require('../models/User'); 

beforeAll(async () => {
  // 🧹 Очистить таблицу перед тестами
  await User.destroy({ where: {} });
});

describe('Auth API', () => {
  it('should register and then login the same user', async () => {
    const email = `test${Date.now()}@mail.com`; 


    const registerRes = await request(app)
      .post('/users/register')
      .send({ username: email, password: '12345' });

    expect(registerRes.statusCode).toEqual(201);
    expect(registerRes.body).toHaveProperty('username', email);

    
    const loginRes = await request(app)
      .post('/users/login')
      .send({ username: email, password: '12345' });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
  });
});

afterAll(async () => {
  await User.sequelize.close(); 
});

afterAll(async () => {
  await require('../db').close(); 
});

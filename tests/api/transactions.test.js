const { testApiHandler } = require('next-test-api-route-handler');
const transactionsHandler = require('../../pages/api/transactions').default;
const loginHandler = require('../../pages/api/auth/login').default;

let adminToken, customerToken, clientToken;

beforeAll(async () => {
  async function getToken(credentials) {
    let token = '';
    await testApiHandler({
      handler: loginHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'POST', body: credentials });
        token = (await res.json()).token;
      },
    });
    return token;
  }

  adminToken    = await getToken({ username: 'admin', password: 'admin123' });
  customerToken = await getToken({ username: 'C10001', password: 'customerpw' });
  clientToken   = await getToken({ username: 'client1001', password: 'clientpw' });
});

describe('/api/transactions', () => {
  it('returns only admin data (status 200)', async () => {
    await testApiHandler({
      handler: transactionsHandler,
      params: { limit: '2', page: '1' },
      requestPatcher: (req) => req.headers['authorization'] = `Bearer ${adminToken}`,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(Array.isArray(data.data)).toBe(true);
      }
    });
  });

  it('blocks no token', async () => {
    await testApiHandler({
      handler: transactionsHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(401);
      }
    });
  });
});

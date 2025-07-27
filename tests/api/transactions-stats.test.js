import statsHandler from '../../pages/api/transactions-stats';
import loginHandler from '../../pages/api/auth/login';
import { testApiHandler } from 'next-test-api-route-handler';

let adminToken, clientToken;

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

  adminToken = await getToken({ username: 'admin', password: 'admin123' });
  clientToken = await getToken({ username: 'client1001', password: 'clientpw' });
});

describe('/api/transactions-stats', () => {
  it('returns category-grouped stats for admin', async () => {
    await testApiHandler({
      handler: statsHandler,
      params: { groupBy: 'category' },
      requestPatcher: (req) => req.headers['authorization'] = `Bearer ${adminToken}`,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(Array.isArray(body)).toBe(true);
      }
    });
  });

  it('returns merchant-grouped stats for client', async () => {
    await testApiHandler({
      handler: statsHandler,
      params: { groupBy: 'merchant' },
      requestPatcher: (req) => req.headers['authorization'] = `Bearer ${clientToken}`,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(Array.isArray(body)).toBe(true);
      }
    });
  });
});

const { testApiHandler } = require('next-test-api-route-handler');
const loginHandler = require('../../pages/api/auth/login').default;

describe('POST /api/auth/login', () => {
  it('admin login succeeds and returns role', async () => {
    await testApiHandler({
      handler: loginHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          body: { username: 'admin', password: 'admin123' },
        });
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.token).toBeDefined();
        const payload = JSON.parse(Buffer.from(data.token.split('.')[1], 'base64').toString());
        expect(payload.role).toBe('admin');
      }
    });
  });

  it('fails with wrong credentials', async () => {
    await testApiHandler({
      handler: loginHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          body: { username: 'admin', password: 'wrong' },
        });
        expect(res.status).toBe(401);
      }
    });
  });
});

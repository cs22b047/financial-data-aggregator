// pages/api/auth/login.js
import jwt from 'jsonwebtoken';

const demoAdmin = {
  username: 'admin',
  password: 'admin123',
  role: 'admin',
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  // Admin: username === 'admin'
  if (username === demoAdmin.username && password === demoAdmin.password) {
    const token = jwt.sign(
      { username: demoAdmin.username, role: demoAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    return res.status(200).json({ token });
  }

  // Customer: username = customerId, password is fixed for all customers
  const CUSTOMER_PASSWORD = 'customerpw';

  if (username && username !== 'admin' && password === CUSTOMER_PASSWORD) {
    const token = jwt.sign(
      { username, role: 'customer', customerId: username },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
}

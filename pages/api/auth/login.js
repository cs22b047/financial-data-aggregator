import jwt from 'jsonwebtoken';

const ADMIN = { username: 'admin', password: 'admin123', role: 'admin' };
const CUSTOMER_PASSWORD = 'customerpw';
const CLIENT_PASSWORD = 'clientpw';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
  const { username, password } = req.body;

  // Admin
  if (username === ADMIN.username && password === ADMIN.password) {
    const token = jwt.sign({ username: ADMIN.username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return res.status(200).json({ token });
  }
  // Customer: username = customerID
  if (username && username !== 'admin' && password === CUSTOMER_PASSWORD) {
    const token = jwt.sign({ username, role: 'customer', customerId: username }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return res.status(200).json({ token });
  }
  // Client: username is category, password is clientpw
  if (username && password === CLIENT_PASSWORD) {
    const token = jwt.sign({ username, role: 'client', category: username }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
}

// pages/api/auth/refresh.js
import jwt from 'jsonwebtoken';
import { verifyToken } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const user = verifyToken(req); // Should verify from Authorization header
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  // Copy all payload fields used in app
  const payload = {
    username: user.username,
    role: user.role,
    ...(user.customerId ? { customerId: user.customerId } : {}),
  };

  const newToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // CHANGE to '15m' for production!
  );
  res.status(200).json({ token: newToken });
}

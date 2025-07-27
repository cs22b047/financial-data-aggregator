import jwt from 'jsonwebtoken';

const demoUsers = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'client', password: 'client123', role: 'client', customerId: 'C1760492708' },
  { username: 'user', password: 'user123', role: 'user' },
];

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { username, password } = req.body;
  const user = demoUsers.find(u => u.username === username && u.password === password);

  if (!user)
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { username: user.username, role: user.role, customerId: user.customerId || null },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
  res.status(200).json({ token });
}
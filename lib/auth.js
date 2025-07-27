import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  // Expects header:  Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return null;
  }
}

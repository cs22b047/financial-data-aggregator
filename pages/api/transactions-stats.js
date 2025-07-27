// pages/api/transactions-stats.js
import pool from '../../lib/db';
import { verifyToken } from '../../lib/auth';

const allowedFields = ['gender', 'zipcodeOri', 'merchant', 'category'];

export default async function handler(req, res) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const { groupBy } = req.query; // e.g. "gender", "category", etc.
  if (!allowedFields.includes(groupBy)) {
    return res.status(400).json({ message: 'Invalid groupBy param' });
  }

  let sql = `SELECT ${groupBy}, COUNT(*) as count FROM transactions`;
  let params = [];
  if (user.role === 'customer' && user.customerId) {
    sql += ' WHERE customer = ?';
    params.push(user.customerId);
  }
  sql += ` GROUP BY ${groupBy}`;
  const [rows] = await pool.query(sql, params);
  res.status(200).json(rows);
};

import pool from '../../lib/db';
import { verifyToken } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  // Auth
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  // Pagination
  let limit = parseInt(req.query.limit) || 20;
  let page = parseInt(req.query.page) || 1;
  if (limit > 100) limit = 100;
  const offset = (page - 1) * limit;

  // Role filtering
  let baseQuery = 'SELECT id, step, customer, age, gender, zipcodeOri, merchant, zipMerchant, category, amount, fraud FROM transactions';
  let countQuery = 'SELECT COUNT(*) as total FROM transactions';
  let conditions = [];
  let params = [];
  if (user.role === 'client') {
    conditions.push('customer = ?');
    params.push(user.customerId);  // include customerId in your JWT for clients
  }
  if (user.role === 'user') {
    conditions.push('fraud = 0');
  }
  if (conditions.length) {
    baseQuery += ' WHERE ' + conditions.join(' AND ');
    countQuery += ' WHERE ' + conditions.join(' AND ');
  }
  baseQuery += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  try {
    const [rows] = await pool.query(baseQuery, params);
    const [countRes] = await pool.query(countQuery, params.slice(0, params.length - 2));
    const total = countRes[0]?.total || 0;

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: rows,
    });
  } catch (e) {
    res.status(500).json({ message: 'Database error: ' + e.message });
  }
}
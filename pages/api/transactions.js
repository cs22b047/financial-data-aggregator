import pool from '../../lib/db';
import { verifyToken } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  let limit = parseInt(req.query.limit, 10) || 20;
  let page = parseInt(req.query.page, 10) || 1;
  if (limit > 100) limit = 100;
  const offset = (page - 1) * limit;

  let baseQuery = 'FROM transactions';
  let filter = '';
  let params = [];
  if (user.role === 'customer' && user.customerId) {
    filter = ' WHERE customer = ?';
    params.push(user.customerId);
  }

  // 1. Get total count
  const countQuery = `SELECT COUNT(*) as total ${baseQuery}${filter}`;
  // 2. Get paginated data
  const dataQuery = `SELECT * ${baseQuery}${filter} LIMIT ? OFFSET ?`;
  const paramsWithLimit = [...params, limit, offset];

  try {
    // 1. Count for pagination
    const [countRes] = await pool.query(countQuery, params);
    const total = countRes[0].total;
    const totalPages = Math.ceil(total / limit) || 1;

    // 2. Data
    const [rows] = await pool.query(dataQuery, paramsWithLimit);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      data: rows
    });
  } catch (err) {
    res.status(500).json({ message: 'Database query error', error: err.message });
  }
}

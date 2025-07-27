// pages/api/transactions.js
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

  let { limit = 20, page = 1, gender, merchant, customer, category, sort, order } = req.query;
  limit = parseInt(limit, 10);
  page = parseInt(page, 10);
  if (limit > 100) limit = 100; // to protect server
  const offset = (page - 1) * limit;

  // Build where/sort clauses
  const where = [];
  const params = [];

  // ADMIN: filter by provided query params
  if (user.role === 'admin') {
    if (gender)       { where.push('gender = ?');   params.push(gender); }
    if (merchant)     { where.push('merchant = ?'); params.push(merchant); }
    if (customer)     { where.push('customer = ?'); params.push(customer); }
    if (category)     { where.push('category = ?'); params.push(category); }
  }
  // CUSTOMER: Only their transactions, allow their local filters
  else if (user.role === 'customer' && user.customerId) {
    where.push('customer = ?'); params.push(user.customerId);
    if (merchant)   { where.push('merchant = ?'); params.push(merchant); }
    if (category)   { where.push('category = ?'); params.push(category); }
  }

  let sqlWhere = where.length ? ' WHERE ' + where.join(' AND ') : '';
  let sortClause = '';
  // Only allow sort on whitelisted columns
  const allowedSort = ['step','customer','age','gender','zipcodeOri','merchant','category','amount','fraud'];
  if (sort && allowedSort.includes(sort)) {
    const dir = order && order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    sortClause = ` ORDER BY ${sort} ${dir}`;
  }

  // Paginated data
  const dataQuery = `
    SELECT * FROM transactions
    ${sqlWhere}
    ${sortClause}
    LIMIT ? OFFSET ?
  `;
  // For count query, don't include LIMIT/OFFSET
  const countQuery = `SELECT COUNT(*) as total FROM transactions ${sqlWhere}`;
  const dataParams = [...params, limit, offset];

  try {
    // Count for pagination
    const [countRows] = await pool.query(countQuery, params);
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit) || 1;

    // Get data
    const [rows] = await pool.query(dataQuery, dataParams);

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
  
import { useEffect, useState } from 'react';
import { useAuth } from '../pages/_app';

export default function TransactionsTable() {
  const { token, logout } = useAuth();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  async function fetchData(pageNum = 1) {
    setError('');
    try {
      const res = await fetch(`/api/transactions?limit=${limit}&page=${pageNum}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        logout(); // Token expired/invalid
        window.location.href = '/';
        return;
      }
      const json = await res.json();
      setData(json.data || []);
      setTotalPages(json.totalPages || 1);
    } catch (e) {
      setError('Failed to fetch');
    }
  }

  useEffect(() => {
    if (token) fetchData(page);
  }, [page, token]);

  if (!token) return <p>You must login first.</p>;

  return (
    <>
      <button onClick={logout}>Logout</button>
      <h2>Transactions</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Step</th>
            <th>Customer</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Zipcode Origin</th>
            <th>Merchant</th>
            <th>Zip Merchant</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Fraud</th>
          </tr>
        </thead>
        <tbody>
          {data.map(t => (
            <tr key={t.id}>
              <td>{t.step}</td>
              <td>{t.customer}</td>
              <td>{t.age}</td>
              <td>{t.gender}</td>
              <td>{t.zipcodeOri}</td>
              <td>{t.merchant}</td>
              <td>{t.zipMerchant}</td>
              <td>{t.category}</td>
              <td>{t.amount}</td>
              <td>{t.fraud}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span> Page {page} of {totalPages} </span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
      </div>
    </>
  );
}

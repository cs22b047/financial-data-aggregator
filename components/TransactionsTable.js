import { useEffect, useState } from 'react';
import { useAuth } from '../pages/_app';

// Standard columns for your table
const columns = [
  // { label: "Step", key: "step" },
  { label: "Customer", key: "customer" },
  { label: "Age", key: "age" },
  { label: "Gender", key: "gender" },
  { label: "Zipcode Origin", key: "zipcodeOri" },
  { label: "Merchant", key: "merchant" },
  { label: "Zip Merchant", key: "zipMerchant" },
  { label: "Category", key: "category" },
  { label: "Amount", key: "amount" },
  // { label: "Fraud", key: "fraud" },
];


export default function TransactionsTable() {
  const { token, logout, role } = useAuth();

  // Default filters
  const [filters, setFilters] = useState({
    gender: "",
    merchant: "",
    customer: "",
    category: "",
    fraud: "",
  });

  const [sort, setSort] = useState({ key: "", order: "asc" });
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // For gender dropdown options
  const genderOptions = ["", "F", "M"];

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("page", page);
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
    if (sort.key) { params.append("sort", sort.key); params.append("order", sort.order); }

    fetch(`/api/transactions?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (res.status === 401) { logout(); window.location.href = '/'; return; }
        const json = await res.json();
        setData(json.data || []);
        setTotalPages(json.totalPages || 1);
      })
      .catch(() => setError('Failed to fetch'))
      .finally(() => setLoading(false));
  }, [token, page, limit, filters, sort, logout]);

  function handleSort(colKey) {
    setSort(prev =>
      prev.key === colKey
        ? { key: colKey, order: prev.order === "asc" ? "desc" : "asc" }
        : { key: colKey, order: "asc" }
    );
  }

  
  // Filters to show
const filterFields = role === "admin"
  ? ["gender", "merchant", "customer", "category"]
  : role === "client"
    ? ["merchant"] // Client always fixed to one category
    : ["merchant", "category"];

  if (!token) return <p>You must login first.</p>;

  return (
    <div>
      <button onClick={logout} style={{ float: 'right'}}>Logout</button>
      <h2>Transactions</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* FILTERS */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {filterFields.map(field =>
          field === "gender" ? (
            <label key={field}>
              Gender:
              <select
                value={filters.gender}
                onChange={e => { setPage(1); setFilters(f => ({ ...f, gender: e.target.value })); }}
                style={{ marginLeft: "0.5rem" }}
              >
                {genderOptions.map(opt =>
                  <option key={opt} value={opt}>{opt === "" ? "All" : opt}</option>
                )}
              </select>
            </label>
          ) : (
            <label key={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
              <input
                type="text"
                value={filters[field]}
                onChange={e => { setPage(1); setFilters(f => ({ ...f, [field]: e.target.value })); }}
                placeholder={`Type to filter by ${field}`}
                style={{ marginLeft: "0.5rem" }}
              />
            </label>
          )
        )}
      </div>

      {loading && <p>Loading...</p>}

      {/* TABLE */}
      <table border="1" cellPadding={6} style={{ width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
            {columns.map(col =>
              <th
                key={col.key}
                style={{ cursor: "pointer" }}
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {(sort.key === col.key) ? (sort.order === "asc" ? " ▲" : " ▼") : ""}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((t, idx) => (
            <tr key={t.id || idx}>
              {columns.map(col => <td key={col.key}>{t[col.key]}</td>)}
            </tr>
          ))}
          {(!loading && data.length === 0) &&
            <tr>
              <td colSpan={columns.length}><i>No results found.</i></td>
            </tr>
          }
        </tbody>
      </table>

      {/* PAGINATION */}
      <div style={{ margin: "1rem 0", display:"flex", alignItems: 'center', gap: "1rem" }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span> Page {page} of {totalPages} </span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}

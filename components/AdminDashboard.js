// components/AdminDashboard.js
import { useState, useEffect } from 'react';
import { useAuth } from '../pages/_app';
import FilterPanel from './FilterPanel';
import TransactionsTable from './TransactionsTable';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [filters, setFilters] = useState({
    gender: '', merchant: '', customer: '', category: ''
  });
  const [sort, setSort] = useState({ column: '', order: 'asc' });
  const [data, setData] = useState([]);
  const [allOptions, setAllOptions] = useState({}); // for populating dropdowns

  // Fetch options for dropdowns on mount
  useEffect(() => {
    async function fetchOptions() {
      const [merchants, customers, categories] = await Promise.all([
        fetch('/api/distinct/merchants', { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json()),
        fetch('/api/distinct/customers', { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json()),
        fetch('/api/distinct/categories', { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json())
      ]);
      setAllOptions({ merchants, customers, categories });
    }
    fetchOptions();
  }, [token]);

  // Fetch filtered+sorted data
  useEffect(() => {
    let qs = [];
    Object.entries(filters).forEach(([k,v]) => { if(v) qs.push(`${k}=${encodeURIComponent(v)}`); });
    if(sort.column) qs.push(`sort=${sort.column}&order=${sort.order}`);
    const query = qs.length ? '?' + qs.join('&') : '';
    fetch(`/api/transactions${query}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => setData(json.data || []));
  }, [filters, sort, token]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        options={{
          gender: ["", "M", "F", "Other"],
          merchant: ["", ...(allOptions.merchants || [])],
          customer: ["", ...(allOptions.customers || [])],
          category: ["", ...(allOptions.categories || [])]
        }}
      />
      <TransactionsTable
        data={data}
        sort={sort}
        setSort={setSort}
        enableSorting={true}
      />
    </div>
  );
}

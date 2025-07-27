// components/CustomerDashboard.js
import { useState, useEffect } from 'react';
import { useAuth } from '../pages/_app';
import FilterPanel from './FilterPanel';
import TransactionsTable from './TransactionsTable';

export default function CustomerDashboard() {
  const { token } = useAuth();
  const [filters, setFilters] = useState({
    category: '', merchant: '', fraud: '', minAmount: '', maxAmount: ''
  });
  const [sort, setSort] = useState({ column: '', order: 'asc' });
  const [data, setData] = useState([]);
  const [allOptions, setAllOptions] = useState({});

  useEffect(() => {
    async function fetchOptions() {
      const [merchants, categories] = await Promise.all([
        fetch('/api/distinct/merchants', { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json()),
        fetch('/api/distinct/categories', { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json())
      ]);
      setAllOptions({ merchants, categories });
    }
    fetchOptions();
  }, [token]);

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
      <h2>Customer Dashboard</h2>
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        options={{
          category: ["", ...(allOptions.categories || [])],
          merchant: ["", ...(allOptions.merchants || [])],
          fraud: ["", "Yes", "No"]
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

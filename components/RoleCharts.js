import { useEffect, useState } from 'react';
import { useAuth } from '../pages/_app';
import PieChart from './PieChart';
import BarChart from './BarChart';

// Your chart setup and API logic is unchanged

function formatData(rows, field) {
  return {
    labels: rows.map(r => r[field] || 'Unknown'),
    datasets: [{
      data: rows.map(r => r.count || r.sum || 0),
      backgroundColor: [
        '#4bc0c0', '#f3ba2f', '#50AF95', '#2a71d0', '#e14c3a', '#a88be8', '#ff6384', '#36a2eb'
      ]
    }]
  };
}

export default function RoleCharts() {
  const { token, role } = useAuth();
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    if (!token) return;
    // For demo: use two bars and two pies, adjust titles/groupBy/top as needed
    const configs =
  role === 'admin'
    ? [
        { key: 'merchant', type: 'bar', title: 'Top Merchants', groupBy: 'merchant', top: 10 },
        { key: 'category', type: 'pie', title: 'Transactions by Category', groupBy: 'category' },
        { key: 'gender', type: 'pie', title: 'Transactions by Gender', groupBy: 'gender' },
        { key: 'zipcodeOri', type: 'bar', title: 'Transactions by Zipcode', groupBy: 'zipcodeOri' },
      ]
  : role === 'customer'
    ? [
        { key: 'merchant', type: 'bar', title: 'Your Top Merchants', groupBy: 'merchant', top: 5 },
        { key: 'category', type: 'pie', title: 'Your Transactions by Category', groupBy: 'category' },
        { key: 'zipcodeOri', type: 'bar', title: 'Your Transactions by Zipcode', groupBy: 'zipcodeOri' },
        { key: 'merchant', type: 'pie', title: 'Your Merchant Share', groupBy: 'merchant', top: 5 }
      ]
  : role === 'client'
    ? [
        { key: 'merchant', type: 'bar', title: 'Top Merchants in This Category', groupBy: 'merchant', top: 5 },
        { key: 'zipcodeOri', type: 'bar', title: 'Transactions by Zipcode (in Category)', groupBy: 'zipcodeOri' },
        // For "client", category is always ONE value, so don't show a category pie!
        { key: 'merchant', type: 'pie', title: 'Merchant Share (in Category)', groupBy: 'merchant', top: 5 },
        { key: 'gender', type: 'pie', title: 'Gender Share (in Category)', groupBy: 'gender' }
      ]
  : [];

    Promise.all(
      configs.map(async ({ groupBy, top, ...rest }) => {
        const url = `/api/transactions-stats?groupBy=${groupBy}` + (top ? `&top=${top}` : '');
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const rows = await res.json();
        let outRows = rows;
        if (top) outRows = rows.sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, top);
        return { ...rest, groupBy, rows: outRows };
      })
    ).then(setCharts);
  }, [token, role]);

  // Now arrange as 2x2: [Bar, Pie] [Pie, Bar]
  if (charts.length < 4) return null;
  return (
    <div className="grid grid-cols-2 gap-4 ">
      <div className=''>
        <BarChart {...charts[0]} data={formatData(charts[0].rows, charts[0].groupBy)} />
      </div>
      <div>
        <PieChart {...charts[1]} data={formatData(charts[1].rows, charts[1].groupBy)} />
      </div>
      <div>
        <PieChart {...charts[2]} data={formatData(charts[2].rows, charts[2].groupBy)} />
      </div>
      <div>
        <BarChart {...charts[3]} data={formatData(charts[3].rows, charts[3].groupBy)} />
      </div>

    </div>
  );
}

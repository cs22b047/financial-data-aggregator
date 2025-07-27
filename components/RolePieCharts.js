import { useEffect, useState } from "react";
import { useAuth } from "../pages/_app";
import PieChart from "./PieChart";

// Helper to make chart data
function formatPieData(rows, labelField) {
  return {
    labels: rows.map(r => r[labelField] ?? "Unknown"),
    datasets: [{
      data: rows.map(r => r.count),
      backgroundColor: [
        '#4bc0c0', '#f3ba2f', '#50AF95', '#2a71d0', '#e14c3a', '#a88be8', '#ffd700', '#00bfae'
      ],
    }]
  };
}

const ADMIN_FIELDS = [
  { key: "gender", title: "Gender" },
  { key: "zipcodeOri", title: "Zipcode" },
  { key: "merchant", title: "Merchant" },
  { key: "category", title: "Category" }
];
const CUSTOMER_FIELDS = [
  { key: "merchant", title: "Merchant" },
  { key: "category", title: "Category" }
];

export default function RolePieCharts() {
  const { token, role } = useAuth();
  const choices = role === "admin" ? ADMIN_FIELDS : CUSTOMER_FIELDS;
  const [selected, setSelected] = useState(choices[0].key);
  const [pieRows, setPieRows] = useState([]);

  // Fetch pie data when selection changes
  useEffect(() => {
    if (!token || !selected) return;
    fetch(`/api/transactions-stats?groupBy=${selected}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(rows => setPieRows(rows));
  }, [token, selected]);

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <div style={{ marginBottom: 16 }}>
        <label>
          Show distribution by:&nbsp;
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
          >
            {choices.map(opt => (
              <option key={opt.key} value={opt.key}>
                {opt.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <PieChart
        data={formatPieData(pieRows, selected)}
        title={
          "Number of Transactions by " +
          (choices.find(c => c.key === selected)?.title || selected)
        }
      />
    </div>
  );
}

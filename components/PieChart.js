import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register elements *once*, ideally at the top level (e.g., in App.js or the chart file)
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data, title }) {
  if (!data?.labels?.length) return <div>No data for {title}</div>;
  return (
    <div style={{ width: 380, margin: 20 }}>
      <h4 style={{ textAlign: "center" }}>{title}</h4>
      <Pie
        data={data}
        options={{
          plugins: { legend: { position: 'right' } },
        }}
      />
    </div>
  );
}

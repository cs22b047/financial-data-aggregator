import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BarChart({ data, title }) {
  if (!data?.labels?.length) return <div className="text-gray-400 text-xs text-center">No data for {title}</div>;
  return (
    <div className="bg-white rounded shadow-lg p-4 mb-6 flex flex-col items-center w-full">
      <h3 className="text-lg text-center font-semibold mb-2">{title}</h3>
      {/* The same container size as PieChart for alignment */}
      <div className="relative " style={{ width: '340px', height: '340px' }}>
        <Bar
          data={data}
          options={{
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, ticks: { font: { size: 13 } } },
              x: { ticks: { font: { size: 12 } }, grid: { display: false } },
            },
            maintainAspectRatio: false,
            responsive: false,
          }}
          width={320} height={320}
        />
      </div>
    </div>
  );
}

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data, title }) {
  if (!data?.labels?.length) return (
    <div className="text-gray-400 text-xs text-center">
      No data for {title}
    </div>
  );
  return (
    <div className="bg-white rounded shadow p-6 mb-6 flex flex-col items-center w-full">
      <h3 className="text-xl text-center font-semibold mb-3">{title}</h3>
      <div
        className="flex items-center justify-center"      // centers horizontally and vertically
        style={{
          width: '400px',
          height: '400px',
          minHeight: '400px',
        }}
      >
        <Pie
          data={data}
          options={{
            plugins: {
              legend: {
                position: 'bottom',
                labels: { boxWidth: 18, font: { size: 16 } },
              },
            },
            maintainAspectRatio: false,
            responsive: false,
          }}
          width={380}
          height={380}
        />
      </div>
    </div>
  );
}

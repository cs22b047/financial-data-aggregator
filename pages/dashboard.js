import TransactionsTable from '../components/TransactionsTable';
import RoleCharts from '../components/RoleCharts';

export default function Dashboard() {
  // ...authentication checks as before...
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-violet-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-7xl mt-2 flex flex-col gap-8">
        <h1 className="mb-4 text-4xl text-center font-extrabold  font-sans leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">
          Financial Insights Dashboard
        </h1>
        <div className="bg-white/70 rounded-2xl shadow-2xl px-8 py-6 mb-6">
          <TransactionsTable />
        </div>
        <section>
          <h2 className="text-2xl font-semibold text-blue-800 mb-5 ml-1 tracking-tight drop-shadow">
            Analytics & Trends
          </h2>
          <RoleCharts />
        </section>
      </div>
    </div>
  );
}

import { useAuth } from './_app';
import { useEffect } from 'react';
import TransactionsTable from '../components/TransactionsTable';

export default function Dashboard() {
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && !token) window.location.href = '/';
  }, [loading, token]);

  if (loading) return <div>Loading...</div>;
  if (!token) return null;

  return (
    <div>
      <h1>Dashboard</h1>
      <TransactionsTable />
    </div>
  );
}

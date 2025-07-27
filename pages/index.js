import { useAuth } from './_app';
import { useEffect } from 'react';
import LoginForm from '../components/LoginForm';

export default function Home() {
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      window.location.href = '/dashboard';
    }
  }, [loading, token]);

  // Don't render login form until loading is done
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Financial Data Aggregator</h1>
      <LoginForm />
    </div>
  );
}

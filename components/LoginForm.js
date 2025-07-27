import { useState } from 'react';
import { useAuth } from '../pages/_app';

export default function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      // Decode payload for role (jwt.io or jwt-decode can be used for large payloads)
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      login(data.token, payload);
      window.location.href = '/dashboard';
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {err && <p style={{ color: 'red' }}>{err}</p>}
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username"/>
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"/>
      <button type="submit">Login</button>
    </form>
  );
}

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Alert from '../components/ui/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Email and password are required.');
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login with those credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="surface w-full max-w-md p-6">
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Sign in to continue your counselling workspace.</p>
      <div className="mt-6 space-y-4">
        {error && <Alert>{error}</Alert>}
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </div>
      <p className="mt-6 text-center text-sm text-zinc-500">
        New here? <Link className="font-semibold text-zinc-950 dark:text-white" to="/register">Create an account</Link>
      </p>
    </form>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/ui/Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.name || !form.email || form.password.length < 6) return setError('Name, email, and a 6 character password are required.');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="surface w-full max-w-md p-6">
      <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Start your AI career counselling profile.</p>
      <div className="mt-6 space-y-4">
        {error && <Alert>{error}</Alert>}
        <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </div>
      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account? <Link className="font-semibold text-zinc-950 dark:text-white" to="/login">Login</Link>
      </p>
    </form>
  );
}

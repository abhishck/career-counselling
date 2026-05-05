import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-50 px-4 text-center dark:bg-zinc-950">
      <div>
        <p className="text-sm font-semibold text-zinc-500">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Page not found</h1>
        <Link className="btn-primary mt-6" to="/dashboard">
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}

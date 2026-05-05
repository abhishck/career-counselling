import { Link, Outlet } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle.jsx';

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container-page flex min-h-screen flex-col">
        <header className="flex h-20 items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight">
            Pathwise
          </Link>
          <ThemeToggle />
        </header>
        <section className="grid flex-1 place-items-center py-10">
          <Outlet />
        </section>
      </div>
    </main>
  );
}

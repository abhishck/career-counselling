import { BarChart3, Brain, FileText, History, LayoutDashboard, LogOut, Menu, MessageSquare, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/resume-analyzer', label: 'Resume', icon: FileText },
  { to: '/chatbot', label: 'Chatbot', icon: MessageSquare },
  { to: '/career-test', label: 'Career Test', icon: Brain },
  { to: '/test-results', label: 'Results', icon: BarChart3 },
  { to: '/chat-history', label: 'History', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-zinc-200 bg-white p-4 transition-transform dark:border-zinc-800 dark:bg-zinc-900 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-12 items-center justify-between">
          <Link to="/dashboard" className="text-xl font-bold tracking-tight">
            Pathwise
          </Link>
          <button className="btn-secondary px-2.5 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className="mt-8 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute inset-x-4 bottom-4 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <p className="truncate text-sm font-semibold">{user?.name || user?.email || 'Career member'}</p>
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {open && <button aria-label="Close overlay" className="fixed inset-0 z-30 bg-zinc-950/30 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-zinc-50/85 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
          <div className="container-page flex h-16 items-center justify-between">
            <button className="btn-secondary px-2.5 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={18} />
            </button>
            <div className="hidden text-sm font-medium text-zinc-500 lg:block">AI Career Counselling Workspace</div>
            <ThemeToggle />
          </div>
        </header>
        <main className="container-page py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

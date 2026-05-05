import { Moon, Sun } from 'lucide-react';
import { useUI } from '../../context/UIContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useUI();

  return (
    <button className="btn-secondary px-2.5" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

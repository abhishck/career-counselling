export default function Alert({ children, type = 'error' }) {
  const tone = type === 'error' ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200' : 'border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200';
  return <div className={`rounded-lg border px-4 py-3 text-sm ${tone}`}>{children}</div>;
}

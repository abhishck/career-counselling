export default function Loader({ fullScreen = false, label = 'Loading' }) {
  return (
    <div className={fullScreen ? 'grid min-h-screen place-items-center bg-zinc-50 dark:bg-zinc-950' : 'grid place-items-center py-12'}>
      <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-teal-500" />
        {label}
      </div>
    </div>
  );
}

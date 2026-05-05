export default function EmptyState({ title, description }) {
  return (
    <div className="surface grid place-items-center px-6 py-14 text-center">
      <div>
        <h3 className="font-semibold">{title}</h3>
        {description && <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>}
      </div>
    </div>
  );
}

export default function FeatureCard({ icon: Icon, title, description, children }) {
  return (
    <div className="surface p-5 transition hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700">
      {Icon && (
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
          <Icon size={21} />
        </div>
      )}
      <h3 className="font-semibold tracking-tight">{title}</h3>
      {description && <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{description}</p>}
      {children}
    </div>
  );
}

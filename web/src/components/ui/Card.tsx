export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardClassName = [
    "bg-surface border border-gray rounded-2xl p-6 shadow-card",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClassName}>
      {children}
    </div>
  );
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-soft min-h-screen p-10">
      <div className="max-w-7xl mx-auto space-y-8">{children}</div>
    </main>
  );
}

type NcbiReference = {
  label: string;
  href: string;
};

type NcbiReferencesProps = {
  items: NcbiReference[];
};

export function NcbiReferences({ items }: NcbiReferencesProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-3 text-xs text-slate-500">
      <p className="font-semibold text-slate-500">References (NCBI)</p>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="hover:underline"
              target="_blank"
              rel="noreferrer noopener"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

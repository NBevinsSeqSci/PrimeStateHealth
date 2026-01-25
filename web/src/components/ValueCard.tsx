interface Props {
  title: string;
  description: string;
}

export default function ValueCard({ title, description }: Props) {
  return (
    <div className="rounded-2xl border p-5 shadow-sm">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-sm opacity-80">{description}</p>
    </div>
  );
}

export function computeCompleteness(required: string[], hasValue: (slug: string) => boolean) {
  const present = required.filter(hasValue);
  const missing = required.filter((slug) => !hasValue(slug));
  return {
    present,
    missing,
    presentCount: present.length,
    requiredCount: required.length,
    pct: required.length ? present.length / required.length : 0,
  };
}

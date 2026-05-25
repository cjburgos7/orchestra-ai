export function createSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return base || "startup";
}

export function uniqueSlug(base: string, existing: string[]): string {
  let slug = createSlug(base);
  if (!existing.includes(slug)) return slug;

  let i = 2;
  while (existing.includes(`${slug}-${i}`)) i++;
  return `${slug}-${i}`;
}

export type SavedEntry = { kind: "article" | "tool"; id: number; label: string; href: string };

export function parseSavedItems(raw: string | null): SavedEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(item => item && (item.kind === "article" || item.kind === "tool") && Number.isInteger(item.id) && typeof item.label === "string" && typeof item.href === "string") : [];
  } catch { return []; }
}

export function toggleSavedItem(current: SavedEntry[], item: SavedEntry): SavedEntry[] {
  const exists = current.some(entry => entry.kind === item.kind && entry.id === item.id);
  return exists ? current.filter(entry => !(entry.kind === item.kind && entry.id === item.id)) : [...current, item];
}

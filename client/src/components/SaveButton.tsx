import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { parseSavedItems, toggleSavedItem, type SavedEntry } from "@/lib/savedItems";
import { Bookmark, Check } from "lucide-react";
import { useEffect, useState } from "react";

const storageKey = "aitoolbox-saved-items";

function readSavedItems(): SavedEntry[] { return parseSavedItems(localStorage.getItem(storageKey)); }

function writeSavedItems(items: SavedEntry[]) { localStorage.setItem(storageKey, JSON.stringify(items)); }

export function getLocalSavedItems() { return typeof window === "undefined" ? [] : readSavedItems(); }

export default function SaveButton({ item }: { item: SavedEntry }) {
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(false);
  const utils = trpc.useUtils();
  const save = trpc.engagement.save.useMutation({ onSuccess: () => utils.engagement.saved.invalidate() });
  const unsave = trpc.engagement.unsave.useMutation({ onSuccess: () => utils.engagement.saved.invalidate() });

  useEffect(() => { setSaved(readSavedItems().some(entry => entry.kind === item.kind && entry.id === item.id)); }, [item.id, item.kind]);

  function toggle() {
    const current = readSavedItems();
    const exists = current.some(entry => entry.kind === item.kind && entry.id === item.id);
    const next = toggleSavedItem(current, item);
    writeSavedItems(next);
    setSaved(!exists);
    if (isAuthenticated) {
      if (exists) unsave.mutate({ kind: item.kind, id: item.id });
      else save.mutate({ kind: item.kind, id: item.id });
    }
  }

  return <button type="button" onClick={toggle} aria-pressed={saved} title={saved ? "إزالة من المحفوظات" : "حفظ للرجوع إليه"} className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${saved ? "border-violet-300/50 bg-violet-400/15 text-violet-100" : "border-white/10 bg-white/[0.025] text-slate-300 hover:border-violet-300/50 hover:text-white"}`}>{saved ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}{saved ? "محفوظ" : "حفظ"}</button>;
}

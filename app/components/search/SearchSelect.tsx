import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

type Item = {
  code: string | number;
  name: string;
};

interface SearchSelectProps {
  url: string; // URL to a JSON file containing Array<{code,name}>
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputClassName?: string;
  containerClassName?: string;
  maxItems?: number;
}

export function SearchSelect({
  url,
  value,
  onChange,
  placeholder = "Cari kode/nama...",
  inputClassName,
  containerClassName,
  maxItems = 5,
}: SearchSelectProps) {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load JSON once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const data = (await res.json()) as Item[];
        const items: Item[] = Array.isArray(data)
          ? data
              .filter((it) =>
                it && (typeof it.name === "string") && (typeof it.code === "string" || typeof it.code === "number")
              )
          : [];
        if (mounted) setAllItems(items);
      } catch (e) {
        // fail silently
      }
    })();
    return () => {
      mounted = false;
    };
  }, [url]);

  // Filtered items by query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems.slice(0, maxItems);
    const res = allItems.filter((it) => {
      const codeStr = String(it.code).toLowerCase();
      return codeStr.includes(q) || it.name.toLowerCase().includes(q);
    });
    return res.slice(0, maxItems);
  }, [allItems, query, maxItems]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sync query with value when value changes from outside
  useEffect(() => {
    if (!open) setQuery(value || "");
  }, [value, open]);

  const handleSelect = (it: Item) => {
    onChange(it.name);
    setQuery(it.name);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      e.preventDefault();
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlight((h) => Math.max(h - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      const it = filtered[highlight];
      if (it) handleSelect(it);
      e.preventDefault();
    } else if (e.key === "Escape") {
      setOpen(false);
      e.preventDefault();
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", containerClassName)}>
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={cn("w-full px-4 py-3 rounded-xl", inputClassName)}
      />

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">Tidak ada hasil</div>
          ) : (
            <ul>
              {filtered.map((it, idx) => (
                <li
                  key={`${it.code}-${it.name}-${idx}`}
                  className={cn(
                    "px-4 py-3 cursor-pointer text-sm flex items-center justify-between",
                    idx === highlight ? "bg-blue-50" : "hover:bg-gray-50"
                  )}
                  onMouseEnter={() => setHighlight(idx)}
                  onMouseDown={(e) => {
                    // prevent input blur before click handler
                    e.preventDefault();
                    handleSelect(it);
                  }}
                >
                  <span className="font-medium text-gray-800">{String(it.code)}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-700">{it.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchSelect;

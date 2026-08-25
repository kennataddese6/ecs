"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar({ placeholder = "Search products..." }: { placeholder?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState(searchParams.get("q") || searchParams.get("search") || "");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-12 h-9 text-xs bg-muted/50 focus:bg-background border-border rounded-xl"
      />
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />

      {query ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      ) : (
        <kbd className="hidden lg:inline-flex absolute right-2.5 top-2 items-center gap-1 rounded border border-border bg-card px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
    </form>
  );
}

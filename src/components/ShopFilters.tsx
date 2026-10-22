"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { copy } from "@/config/copy.id";

interface ShopFiltersProps {
  categories: Array<{ id: string; name: string; slug: string }>;
  currentCategory?: string;
  currentOccasion?: string;
  currentSort?: string;
}

export function ShopFilters({
  categories,
  currentCategory = "",
  currentOccasion = "",
  currentSort = "newest",
}: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const occasions = [
    { label: copy.shop.allOccasions, value: "ALL" },
    { label: "Ulang Tahun", value: "birthday" },
    { label: "Wisuda", value: "graduation" },
    { label: "Anniversary", value: "anniversary" },
    { label: "Pernikahan", value: "wedding" },
  ];

  const sortOptions = [
    { label: copy.shop.sortNewest, value: "newest" },
    { label: copy.shop.sortPriceAsc, value: "price-asc" },
    { label: copy.shop.sortPriceDesc, value: "price-desc" },
  ];

  return (
    <div className="space-y-4 bg-surface border border-border rounded-theme p-4 sm:p-5">
      {/* Category Tabs / Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleFilterChange("category", "ALL")}
          className={`px-3.5 py-1.5 rounded-theme text-xs font-semibold transition-colors min-h-[38px] ${
            !currentCategory || currentCategory === "ALL"
              ? "bg-primary text-onPrimary shadow-sm"
              : "bg-bg text-ink border border-border hover:bg-surfaceStrong"
          }`}
        >
          {copy.categories.all}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleFilterChange("category", cat.slug)}
            className={`px-3.5 py-1.5 rounded-theme text-xs font-semibold transition-colors min-h-[38px] ${
              currentCategory === cat.slug
                ? "bg-primary text-onPrimary shadow-sm"
                : "bg-bg text-ink border border-border hover:bg-surfaceStrong"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Occasion & Sort Dropdowns */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-border">
        {/* Occasion Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="occasion-filter" className="text-xs font-semibold text-ink shrink-0">
            {copy.shop.filterOccasion}:
          </label>
          <select
            id="occasion-filter"
            value={currentOccasion || "ALL"}
            onChange={(e) => handleFilterChange("occasion", e.target.value)}
            className="px-3 py-1.5 bg-bg border border-border rounded-theme text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[38px]"
          >
            {occasions.map((occ) => (
              <option key={occ.value} value={occ.value}>
                {occ.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-filter" className="text-xs font-semibold text-ink shrink-0">
            {copy.shop.sortBy}:
          </label>
          <select
            id="sort-filter"
            value={currentSort || "newest"}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="px-3 py-1.5 bg-bg border border-border rounded-theme text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[38px]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

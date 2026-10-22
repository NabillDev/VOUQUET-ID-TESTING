import { copy } from "@/config/copy.id";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-surfaceStrong focus:text-ink focus:border focus:border-primary focus:shadow-md focus:rounded-theme focus:font-medium text-sm transition-all"
    >
      {copy.common.skipToContent}
    </a>
  );
}

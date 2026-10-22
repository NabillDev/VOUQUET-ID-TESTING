"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle, ArrowRight } from "lucide-react";
import { loginAdminAction } from "@/app/actions/admin";
import { copy } from "@/config/copy.id";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await loginAdminAction(password);
      if (res.success) {
        router.push("/admin/orders");
        router.refresh();
      } else {
        setError(res.error || copy.admin.invalidPassword);
      }
    });
  };

  return (
    <div className="max-w-md mx-auto py-16 sm:py-24 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-surfaceStrong border border-border flex items-center justify-center text-primary">
          <Lock className="w-5 h-5" />
        </div>
        <h1 className="font-display font-bold text-2xl text-ink">
          {copy.admin.loginTitle}
        </h1>
        <p className="text-xs text-inkMuted max-w-xs mx-auto">
          {copy.admin.loginSubtitle}
        </p>
      </div>

      <div className="bg-surface border border-border rounded-theme p-6 sm:p-8 space-y-6">
        {error && (
          <div className="p-3.5 bg-surfaceStrong border border-primary/30 rounded-theme flex items-start gap-2.5 text-xs text-ink">
            <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold text-ink"
            >
              {copy.admin.passwordLabel}
            </label>
            <input
              id="admin-password"
              type="password"
              required
              placeholder={copy.admin.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary text-onPrimary font-semibold text-sm rounded-theme hover:bg-primaryHover transition-all min-h-[44px] disabled:opacity-60 shadow-sm"
          >
            {isPending ? (
              <span>{copy.admin.loggingIn}</span>
            ) : (
              <>
                <span>{copy.admin.loginButton}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

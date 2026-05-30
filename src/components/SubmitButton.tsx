"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

const VARIANTS = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "border border-slate-300 bg-white text-ink hover:bg-slate-50",
  ghost: "text-brand-700 hover:bg-brand-50",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

/**
 * Submit button that disables and shows a pending label while a server action
 * runs. Used by every form that triggers an agent so leaders get clear feedback.
 */
export function SubmitButton({
  children,
  pendingLabel = "Working…",
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

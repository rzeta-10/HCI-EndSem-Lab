// EmptyStateCard - Nielsen H8: Minimalist aesthetic - icon + 1-line label + 1 CTA.
// Google-search-style empty states: simple, friendly, one clear next action.
// Icon is a React node (SVG component) - no CDN, theme-aware via currentColor.

import React from "react";

interface EmptyStateCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyStateCard = ({ icon, title, description, actionLabel, onAction }: EmptyStateCardProps) => {
  return (
    <section className="doodle-panel bg-[var(--surface)] p-8 text-center">
      <div
        className="empty-illustration mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: "var(--surface-muted)", color: "var(--ink-soft)" }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-ink" style={{ letterSpacing: "-0.02em" }}>
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm" style={{ color: "var(--ink-soft)" }}>
        {description}
      </p>
      {actionLabel && onAction ? (
        <button type="button" className="doodle-primary-btn mt-5 px-6 py-3" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
};

export default EmptyStateCard;

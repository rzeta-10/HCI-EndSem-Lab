// ConfirmSketchModal - Shneiderman Rule 5: error prevention via typed confirmation.
// Asimov Law 1: harm prevention - user must actively confirm destructive actions.
// AlertTriangleIcon replaces fluency CDN icon - no CDN, theme-aware.

import { useEffect, useState } from "react";
import { AlertTriangleIcon } from "./Icons";

interface ConfirmSketchModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmKeyword?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmSketchModal = ({
  open,
  title,
  description,
  confirmLabel,
  confirmKeyword,
  onConfirm,
  onCancel,
}: ConfirmSketchModalProps) => {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (!open) setTypedText("");
  }, [open]);

  if (!open) return null;

  const isEnabled = !confirmKeyword || typedText.trim().toUpperCase() === confirmKeyword.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4">
      <div className="doodle-panel w-full max-w-lg p-6">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "rgba(220,38,38,0.10)", color: "#dc2626" }}
        >
          <AlertTriangleIcon size={24} />
        </div>

        <h3 className="text-2xl font-black text-ink" style={{ letterSpacing: "-0.03em" }}>
          {title}
        </h3>
        <p className="mt-3 text-sm" style={{ color: "var(--ink-soft)" }}>{description}</p>

        {confirmKeyword ? (
          <div className="mt-4">
            <p className="text-sm font-semibold text-ink">
              Type{" "}
              <span
                className="rounded-md px-2 py-0.5 font-mono text-sm"
                style={{ background: "rgba(249,115,22,0.10)", color: "var(--accent-strong)" }}
              >
                {confirmKeyword}
              </span>{" "}
              to continue.
            </p>
            <input
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              className="doodle-input mt-2"
              placeholder="Type confirmation text"
              aria-label={`Type ${confirmKeyword} to confirm`}
            />
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="doodle-secondary-btn px-5 py-2.5" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="doodle-primary-btn px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!isEnabled}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSketchModal;

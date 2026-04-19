// Shneiderman Rule 4: closure - order success modal is a definitive confirmation moment.
// Gestalt Symmetry: modal centered, symmetric layout signals trustworthiness.
// CheckCircleIcon replaces fluency CDN icon - no CDN, theme-aware.

import { CheckCircleIcon } from "./Icons";

interface OrderSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const OrderSuccessModal = ({ open, onClose }: OrderSuccessModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="doodle-panel w-full max-w-md p-6 text-center shadow-doodle">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "rgba(22,163,74,0.12)", color: "#16a34a" }}
        >
          <CheckCircleIcon size={36} />
        </div>
        <h2
          className="text-2xl font-black text-ink"
          style={{ letterSpacing: "-0.03em" }}
        >
          Order Placed Successfully
        </h2>
        <p className="mt-3 text-sm" style={{ color: "var(--ink-soft)" }}>
          Your QuickBite order is confirmed. Track delivery progress in real time.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="doodle-primary-btn mt-5 w-full py-3 text-base"
        >
          Track Order
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessModal;

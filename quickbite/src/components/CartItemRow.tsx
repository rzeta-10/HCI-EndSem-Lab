import { CartLine } from "../types";
import { TrashIcon } from "./Icons";

interface CartItemRowProps {
  line: CartLine;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

const CartItemRow = ({ line, onIncrement, onDecrement, onRemove }: CartItemRowProps) => {
  return (
    <div className="doodle-line-item flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-lg font-bold text-ink">{line.item.name}</p>
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>₹{line.item.price} each</p>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 rounded-xl border px-2 py-1"
          style={{ borderColor: "var(--line)", background: "var(--surface)" }}
        >
          <button
            type="button"
            className="doodle-counter-btn"
            onClick={() => onDecrement(line.item.id)}
            aria-label={`Decrease ${line.item.name}`}
          >
            −
          </button>
          <span className="w-6 text-center font-bold" aria-live="polite">{line.quantity}</span>
          <button
            type="button"
            className="doodle-counter-btn"
            onClick={() => onIncrement(line.item.id)}
            aria-label={`Increase ${line.item.name}`}
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => onRemove(line.item.id)}
          className="doodle-trash-btn"
          aria-label={`Remove ${line.item.name}`}
        >
          <TrashIcon size={14} />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;

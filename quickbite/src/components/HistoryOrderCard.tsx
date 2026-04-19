import { OrderHistoryItem } from "../types";

interface HistoryOrderCardProps {
  order: OrderHistoryItem;
  onReorder: (orderId: string) => void;
}

const HistoryOrderCard = ({ order, onReorder }: HistoryOrderCardProps) => {
  return (
    <article className="doodle-line-item p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-2xl font-bold text-ink">{order.restaurantName}</h4>
          <p className="text-xs font-semibold text-ink/70">Order ID: {order.id}</p>
          <p className="text-xs text-ink/70">Placed: {new Date(order.placedAtISO).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-ink">₹{order.total}</p>
          <p className="text-xs font-semibold text-ink/70">ETA: {order.etaMinutes} min</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {order.lines.map((line) => (
          <span key={`${order.id}-${line.item.id}`} className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-ink/80">
            {line.item.name} x {line.quantity}
          </span>
        ))}
      </div>

      <button type="button" className="doodle-primary-btn mt-4 px-5 py-3" onClick={() => onReorder(order.id)}>
        Reorder
      </button>
    </article>
  );
};

export default HistoryOrderCard;

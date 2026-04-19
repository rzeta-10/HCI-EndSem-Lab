import { FavoriteOrder } from "../types";
import { TrashIcon } from "./Icons";

interface FavoriteOrderCardProps {
  favorite: FavoriteOrder;
  onReorder: (favorite: FavoriteOrder) => void;
  onDelete: (favorite: FavoriteOrder) => void;
}

const FavoriteOrderCard = ({ favorite, onReorder, onDelete }: FavoriteOrderCardProps) => {
  return (
    <article className="doodle-line-item p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-xl font-bold text-ink">{favorite.name}</h4>
          <p className="text-xs" style={{ color: "var(--ink-soft)" }}>{favorite.lines.length} item(s)</p>
        </div>
        <button
          type="button"
          className="doodle-trash-btn"
          onClick={() => onDelete(favorite)}
          aria-label={`Delete favorite ${favorite.name}`}
        >
          <TrashIcon size={14} />
          <span>Delete</span>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {favorite.lines.map((line) => (
          <span
            key={`${favorite.id}-${line.item.id}`}
            className="rounded-full px-2 py-1"
            style={{ background: "var(--surface-muted)", color: "var(--ink-soft)" }}
          >
            {line.item.name} × {line.quantity}
          </span>
        ))}
      </div>

      <button type="button" className="doodle-secondary-btn mt-4" onClick={() => onReorder(favorite)}>
        Reorder
      </button>
    </article>
  );
};

export default FavoriteOrderCard;

// F-Pattern layout: name + price left-anchored (81% left-fixation per §2.5.10).
// Gestalt Figure-Ground: food image is hero; white ground below holds text.
// FSSAI VegMark: colour + shape dual encoding - Universal Design Principle 4 (Perceptible Information).
// Zomato card proportions: 180px image, rating badge overlaid bottom-right of image.
// Fitts's Law: Add-to-cart ≥44px, centred in the right half of the card footer.

import { FoodItem } from "../types";
import { useQuickBite } from "../context/QuickBiteContext";
import VegMark from "./VegMark";

interface FoodCardProps {
  item: FoodItem;
}

const FoodCard = ({ item }: FoodCardProps) => {
  const { state, addToCart, incrementItem, decrementItem } = useQuickBite();
  const cartLine = state.cart.find((line) => line.item.id === item.id);
  const quantity = cartLine?.quantity ?? 0;

  return (
    <article
      className="doodle-panel doodle-pop f-pattern-card flex h-full flex-col overflow-hidden"
      aria-label={`${item.name} - ${item.isVeg ? "Vegetarian" : item.isEgg ? "Contains Egg" : "Non-Vegetarian"} - ₹${item.price}`}
    >
      {/* ── Image with overlaid rating badge (Zomato pattern) ── */}
      <div className="food-card-image-wrap" style={{ borderRadius: 0 }}>
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-44 w-full object-cover"
          loading="lazy"
          style={{ display: "block" }}
        />
        {/* Rating badge: overlaid on image bottom-right - keeps content area clean */}
        <div className="food-card-rating-badge" aria-label={`Rating ${item.rating} out of 5`}>
          ★ {item.rating.toFixed(1)}
        </div>
        {/* Bestseller badge: overlaid top-left - Social Proof */}
        {item.isBestseller && (
          <div className="absolute left-2 top-2 rounded border border-[#b45309] bg-[#f59e0b] px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white shadow-sm">
            Bestseller
          </div>
        )}
      </div>

      {/* ── Content area ── */}
      <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4">
        {/* FSSAI mark + name - Gestalt Proximity groups dietary info with item name */}
        <div className="flex items-start gap-2">
          <VegMark isVeg={item.isVeg} isEgg={item.isEgg} size={13} className="mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-base font-bold leading-snug text-ink sm:text-lg">{item.name}</h3>
            {item.orderCountThisWeek && (
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[var(--accent-strong)]">
                📈 {item.orderCountThisWeek}+ ordered this week
              </p>
            )}
          </div>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-ink/70 sm:text-sm">{item.description}</p>

        {/* Metadata badges - Miller's Law: only 2 meta points (category + time) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
          <span className="food-badge-meta">{item.category}</span>
          <span className="food-badge-meta">{item.prepMinutes} min</span>
          {item.isJain && (
            <span 
              className="rounded-full px-2 py-0.5 text-[0.72rem] font-semibold tracking-wide border"
              style={{ backgroundColor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" }}
            >
              Jain
            </span>
          )}
          {item.isHalal && (
            <span 
              className="rounded-full px-2 py-0.5 text-[0.72rem] font-semibold tracking-wide border"
              style={{ backgroundColor: "#ccfbf1", color: "#115e59", borderColor: "#99f6e4" }}
            >
              Halal
            </span>
          )}
          {item.spiceLevel && (
            <span 
              className="rounded-full px-2 py-0.5 text-[0.72rem] font-semibold tracking-wide border"
              style={{ backgroundColor: "#ffedd5", color: "#9a3412", borderColor: "#fed7aa" }}
            >
              <span className="mr-1 text-[0.6rem]">🌶️</span>
              {item.spiceLevel}
            </span>
          )}
          {item.allergies && item.allergies.length > 0 && (
            <span 
              className="rounded-full px-2 py-0.5 text-[0.72rem] font-semibold tracking-wide border"
              style={{ backgroundColor: "#f3e8ff", color: "#6b21a8", borderColor: "#e9d5ff" }}
            >
              <span className="mr-1 opacity-70">ⓘ</span> Contains {item.allergies.join(", ")}
            </span>
          )}
        </div>

        {/* ── Price + qty control - pushed to bottom (mt-auto) ── */}
        <div className="mt-auto flex items-center justify-between pt-3">
          {/* Price: largest text in card row - Dominance (§4.7 Visual Design) */}
          <p className="text-xl font-black text-ink">
            ₹{item.price}
          </p>

          {/* Fitts's Law: Add button is wide + tall; qty stepper is compact and branded orange */}
          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => addToCart(item)}
              className="doodle-primary-btn px-5 py-2"
              style={{ fontSize: "0.88rem", borderRadius: "10px" }}
              aria-label={`Add ${item.name} to cart - ₹${item.price}`}
            >
              Add +
            </button>
          ) : (
            <div className="card-qty-control" aria-label={`Quantity for ${item.name}`}>
              <button
                type="button"
                className="doodle-counter-btn"
                onClick={() => decrementItem(item.id)}
                aria-label={`Decrease ${item.name} quantity`}
              >
                −
              </button>
              <span className="card-qty-value" aria-live="polite">{quantity}</span>
              <button
                type="button"
                className="doodle-counter-btn"
                onClick={() => incrementItem(item.id)}
                aria-label={`Increase ${item.name} quantity`}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default FoodCard;

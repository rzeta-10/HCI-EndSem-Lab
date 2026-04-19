// RestaurantCard - Gestalt Proximity: all restaurant metadata grouped within card boundary.
// Cialdini Social Proof: rating + review count always visible (authority + social proof).
// Monogram hero: restaurant initial letters on brand-color background - no emoji, clean editorial.
// F-Pattern: name top-left, meta left-anchored, offer tag bottom.

import { Restaurant } from "../types";
import { ClockIcon, MapPinIcon, StarIcon, TagIcon } from "./Icons";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  // 2-letter monogram from first letters of first two words
  const monogram = restaurant.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <button
      type="button"
      className="restaurant-card w-full text-left"
      onClick={onClick}
      aria-label={`${restaurant.name} - ${restaurant.rating} stars - ${restaurant.deliveryMinutes} min delivery`}
    >
      {/* ── Hero - food photo when available, monogram fallback ── */}
      <div
        className="restaurant-card-hero"
        style={{
          background: `linear-gradient(135deg, ${restaurant.accentColor}18 0%, ${restaurant.accentColor}30 100%)`,
          borderBottom: `1px solid ${restaurant.accentColor}20`,
          position: "relative",
          overflow: "hidden",
          padding: 0,
        }}
        aria-hidden="true"
      >
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }}
            loading="lazy"
          />
        ) : (
          <span
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              color: restaurant.accentColor,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            {monogram}
          </span>
        )}

        {restaurant.isVegOnly ? (
          <span
            className="veg-only-tag"
            style={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
          >
            Pure Veg
          </span>
        ) : null}
      </div>

      {/* ── Content body ── */}
      <div className="restaurant-card-body">
        <p className="text-sm font-bold leading-snug text-ink truncate">{restaurant.name}</p>
        <p className="mt-0.5 truncate text-xs" style={{ color: "var(--ink-soft)" }}>
          {restaurant.cuisines.join(" · ")}
        </p>

        {/* Rating + time */}
        <div className="mt-2 flex items-center gap-1 text-xs font-semibold">
          <span className="flex items-center gap-0.5" style={{ color: "#16a34a" }}>
            <StarIcon size={12} filled style={{ color: "#16a34a" }} />
            {restaurant.rating.toFixed(1)}
          </span>
          <span style={{ color: "var(--ink-soft)" }}>
            ({restaurant.ratingCount >= 1000
              ? `${(restaurant.ratingCount / 1000).toFixed(1)}k`
              : restaurant.ratingCount})
          </span>
          <span style={{ color: "var(--line)", margin: "0 2px" }}>·</span>
          <span className="flex items-center gap-0.5" style={{ color: "var(--ink-soft)" }}>
            <ClockIcon size={11} />
            {restaurant.deliveryMinutes} min
          </span>
        </div>

        {/* Distance + delivery */}
        <div className="mt-1 flex items-center gap-1 text-xs" style={{ color: "var(--ink-soft)" }}>
          <MapPinIcon size={11} />
          <span>{restaurant.distance}</span>
          <span style={{ color: "var(--line)", margin: "0 2px" }}>·</span>
          {restaurant.deliveryFee === 0
            ? <span style={{ color: "#16a34a", fontWeight: 700 }}>Free delivery</span>
            : <span>₹{restaurant.deliveryFee} delivery</span>}
        </div>

        {/* Offer tag or spacer - keeps all cards same height */}
        <div style={{ marginTop: "auto", paddingTop: "0.5rem", minHeight: "1.75rem" }}>
          {restaurant.offer && (
            <div className="restaurant-offer-tag">
              <TagIcon size={10} />
              {restaurant.offer}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default RestaurantCard;

import { Link, useSearchParams } from "react-router-dom";
import CategoryStrip from "../components/CategoryStrip";
import FoodCard from "../components/FoodCard";
import PortionSizer from "../components/PortionSizer";
import TopNav from "../components/TopNav";
import { useQuickBite } from "../context/QuickBiteContext";
import { menuItems, restaurants } from "../data/menuData";

const MenuScreen = () => {
  const { filteredItems, state, setSelectedCategory, cartCount, priceBreakdown } = useQuickBite();
  const [searchParams] = useSearchParams();

  const restaurantId = searchParams.get("restaurant");
  const activeRestaurant = restaurantId ? restaurants.find((r) => r.id === restaurantId) : null;

  // When a restaurant is selected, filter filteredItems to only that restaurant's items.
  // filteredItems already applies category + search filters from context.
  // Jakob's Law: restaurant-specific menu mirrors Zomato/Swiggy behaviour.
  const displayItems = activeRestaurant
    ? filteredItems.filter((item) => item.restaurantId === restaurantId)
    : filteredItems;

  const showPortionSizer = state.selectedCategory === "Pizza";

  return (
    <div className="page-shell">
      <TopNav showSearch />

      <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-3">

        {/* Restaurant banner - shown only when navigated from a restaurant card */}
        {activeRestaurant && (
          <div
            className="mb-4 overflow-hidden rounded-2xl"
            style={{ border: "1px solid var(--line)" }}
          >
            {/* Hero image */}
            {activeRestaurant.imageUrl && (
              <div style={{ height: "160px", overflow: "hidden" }}>
                <img
                  src={activeRestaurant.imageUrl}
                  alt={activeRestaurant.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 p-4" style={{ background: "var(--surface)" }}>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-ink">{activeRestaurant.name}</h1>
                  {activeRestaurant.isVegOnly && (
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-bold"
                      style={{ background: "#dcfce7", color: "#15803d" }}
                    >
                      Pure Veg
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm" style={{ color: "var(--ink-soft)" }}>
                  {activeRestaurant.cuisines.join(" · ")}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>
                  <span style={{ color: "#16a34a" }}>★ {activeRestaurant.rating.toFixed(1)}</span>
                  <span>{activeRestaurant.ratingCount.toLocaleString()} ratings</span>
                  <span>·</span>
                  <span>{activeRestaurant.deliveryMinutes}–{activeRestaurant.deliveryMinutes + 5} min</span>
                  <span>·</span>
                  <span>{activeRestaurant.distance}</span>
                  <span>·</span>
                  <span>
                    {activeRestaurant.deliveryFee === 0
                      ? <span style={{ color: "#16a34a" }}>Free delivery</span>
                      : `₹${activeRestaurant.deliveryFee} delivery`}
                  </span>
                </div>
                {activeRestaurant.offer && (
                  <p className="mt-1 text-xs font-bold" style={{ color: "var(--accent)" }}>
                    🏷 {activeRestaurant.offer}
                  </p>
                )}
              </div>
              <Link
                to="/menu"
                className="doodle-secondary-btn text-xs"
              >
                ← All Restaurants
              </Link>
            </div>
          </div>
        )}

        <CategoryStrip selectedCategory={state.selectedCategory} onSelectCategory={setSelectedCategory} interactive />

        <section className="mt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-3xl font-bold text-ink">
              {activeRestaurant ? "Menu" : "All Dishes"}
            </h2>
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-ink/70">{displayItems.length} items</p>
              {!activeRestaurant && (
                <Link to="/search" className="doodle-secondary-btn">
                  Advanced Search
                </Link>
              )}
            </div>
          </div>

          <div className={`grid gap-4 ${showPortionSizer ? "lg:grid-cols-[1.35fr_0.65fr]" : "grid-cols-1"}`}>
            <div>
              {displayItems.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {displayItems.map((item) => (
                    <FoodCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="doodle-panel p-8 text-center">
                  <p className="text-2xl font-bold text-ink">No dishes found</p>
                  <p className="mt-2 text-sm text-ink/70">
                    {activeRestaurant
                      ? "Try changing the category filter."
                      : "Try another keyword or reset category to \"All\"."}
                  </p>
                </div>
              )}
            </div>

            {showPortionSizer ? (
              <div className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
                <PortionSizer />
              </div>
            ) : null}
          </div>
        </section>
      </main>

      {/* Fitts's Law: Large sticky checkout target on mobile */}
      <div className="mobile-sticky-bar md:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/70">Cart</p>
          <p className="text-2xl font-bold text-ink">
            {cartCount} item{cartCount === 1 ? "" : "s"}
          </p>
          <p className="text-sm font-semibold text-ink/80">₹{priceBreakdown.total}</p>
        </div>
        <Link to="/checkout" className="doodle-primary-btn px-6 py-4 text-base">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default MenuScreen;

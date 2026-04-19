// HomeScreen - Inverted Pyramid: most important content (search, restaurants) at top.
// Z-Pattern layout: eye moves Z across hero, then down to restaurant grid.
// Cialdini: Social Proof (ratings) and Scarcity (limited offers) in restaurant cards.
// Hick's Law: cuisine categories limited to 7 to minimize decision paralysis.
// No emoji - clean editorial design with colored-dot category pills.

import { useNavigate } from "react-router-dom";
import CategoryStrip from "../components/CategoryStrip";
import RestaurantCard from "../components/RestaurantCard";
import TopNav from "../components/TopNav";
import { foodCategories, restaurants } from "../data/menuData";
import { useQuickBite } from "../context/QuickBiteContext";
import { homeBanners } from "../data/assets";
import { ArrowRightIcon, ZapIcon } from "../components/Icons";

// Clean text-only category grid - no emoji, Gestalt Similarity via consistent chip shape.
const CUISINE_CHIPS = foodCategories.map((c) => ({ label: c.label, tint: c.tint, dot: c.dot }));

const HomeScreen = () => {
  const navigate = useNavigate();
  const { filteredItems, setSelectedCategory } = useQuickBite();

  // Serial Position Effect: first 3 items (Primacy) shown as Quick Picks
  const featuredItems = filteredItems.slice(0, 3);

  return (
    <div className="page-shell">
      <TopNav showSearch />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-28 pt-3">

        {/* ── Hero Banner - Inverted Pyramid: delivery promise front-and-centre ── */}
        <section className="doodle-panel hero-card relative overflow-hidden p-4 sm:p-6">
          <img
            src={homeBanners[0]?.imageUrl}
            alt="Freshly prepared Indian food spread"
            className="hero-media h-52 w-full rounded-2xl object-cover sm:h-60"
          />
          <div className="mt-5">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--accent)", letterSpacing: "0.08em" }}
            >
              Delivering to · IIITDM Kancheepuram
            </p>
            <h1
              className="mt-1.5 text-3xl font-black text-ink sm:text-4xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              Hungry? We've got you.
            </h1>
            <p className="mt-2 max-w-xl text-base" style={{ color: "var(--ink-soft)" }}>
              Order from 50+ trusted restaurants near campus. Pay via UPI in one tap.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="doodle-primary-btn px-8 py-3.5 text-base font-bold"
                onClick={() => navigate("/menu")}
              >
                Order Now
              </button>
              <button
                type="button"
                className="doodle-secondary-btn px-6 py-3.5"
                onClick={() => navigate("/search")}
                aria-label="Search for food"
              >
                Browse Menu
              </button>
            </div>
          </div>
        </section>

        {/* ── Cuisine tiles - clean colored chips, no emoji ── */}
        <section className="doodle-panel p-4">
          <h2 className="text-lg font-bold text-ink">What are you craving?</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {CUISINE_CHIPS.map(({ label, tint, dot }) => (
              <button
                key={label}
                type="button"
                className="cuisine-chip flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all"
                style={{
                  background: tint,
                  borderColor: `${dot}30`,
                  color: "var(--ink)",
                }}
                onClick={() => {
                  setSelectedCategory(label as Parameters<typeof setSelectedCategory>[0]);
                  navigate("/menu");
                }}
                aria-label={`Browse ${label}`}
              >
                <span
                  style={{
                    width: "0.45rem",
                    height: "0.45rem",
                    borderRadius: "50%",
                    background: dot,
                    flexShrink: 0,
                  }}
                />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Restaurants - Gestalt Proximity: card groups metadata cohesively ── */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink">Restaurants near you</h2>
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-semibold"
              style={{ color: "var(--accent)" }}
              onClick={() => navigate("/search")}
            >
              See all
              <ArrowRightIcon size={14} />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} onClick={() => navigate(`/menu?restaurant=${r.id}`)} />
            ))}
          </div>
        </section>

        {/* ── Quick Picks - Serial Position Effect: Primacy items featured ── */}
        <section className="doodle-panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink">Quick Picks</h2>
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--ink-soft)", letterSpacing: "0.08em" }}
            >
              Popular now
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {featuredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(item.category);
                  navigate("/menu");
                }}
                className="quick-pick-card"
                aria-label={`${item.name}, ₹${item.price}`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="quick-pick-thumb h-14 w-14 rounded-xl object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{item.name}</p>
                  <p className="text-sm" style={{ color: "var(--ink-soft)" }}>₹{item.price}</p>
                </div>
                <ArrowRightIcon size={14} style={{ color: "var(--ink-soft)", flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </section>

        {/* ── Category Strip (interactive) ── */}
        <section className="doodle-panel p-4">
          <h2 className="mb-3 text-lg font-bold text-ink">Browse by category</h2>
          <CategoryStrip
            selectedCategory="All"
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              navigate("/menu");
            }}
            interactive
          />
        </section>

        {/* ── Trust signals - Cialdini Authority + Social Proof ── */}
        <section className="doodle-panel p-5">
          <h2 className="text-xl font-bold text-ink">Why QuickBite?</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              {
                Icon: ZapIcon,
                title: "30-min delivery",
                desc: "Real-time tracking from kitchen to doorstep.",
                color: "#f97316",
              },
              {
                Icon: ZapIcon,
                title: "FSSAI Certified",
                desc: "All restaurants verified for food safety compliance.",
                color: "#16a34a",
              },
              {
                Icon: ZapIcon,
                title: "UPI-first payments",
                desc: "Pay with GPay, PhonePe, Paytm, or BHIM in one tap.",
                color: "#2563eb",
              },
            ].map(({ Icon, title, desc, color }) => (
              <div
                key={title}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--line)", background: "var(--surface-muted)" }}
              >
                <span style={{ color }}>
                  <Icon size={18} />
                </span>
                <p className="mt-2 font-bold text-ink">{title}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--ink-soft)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default HomeScreen;

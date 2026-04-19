// ReviewsScreen - Cialdini's Principle of Social Proof made central.
// Anchoring: overall 4.5★ average shown first before any individual review.
// Gestalt Similarity: all star-rating displays use identical icon + hue treatment.
// Serial Position Effect: highest-rated and most-recent reviews in Primacy positions.
// Visual Hierarchy: average score dominates; histogram secondary; individual reviews tertiary.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";

// Seed reviews - realistic Indian names and food-focused feedback
const REVIEWS = [
  {
    id: "r1",
    name: "Priya S.",
    initials: "P",
    colour: "#7C3AED",
    rating: 5,
    date: "2 days ago",
    title: "Best biryani near campus!",
    body: "The Hyderabadi Dum Biryani was perfectly layered - saffron aroma hit me the moment I opened the package. Delivery was exactly 26 minutes. Will reorder.",
    verified: true,
    helpful: 34,
    restaurant: "Behrouz Biryani",
  },
  {
    id: "r2",
    name: "Rahul M.",
    initials: "R",
    colour: "#059669",
    rating: 5,
    date: "1 week ago",
    title: "Masala Dosa perfectly crispy",
    body: "Saravana Bhavan doesn't disappoint. The dosa arrived crispy without becoming soggy during delivery - impressive packaging. Sambar was hot and authentic.",
    verified: true,
    helpful: 28,
    restaurant: "Saravana Bhavan",
  },
  {
    id: "r3",
    name: "Aditi V.",
    initials: "A",
    colour: "#DC2626",
    rating: 4,
    date: "2 weeks ago",
    title: "Great app, one minor issue",
    body: "Love the UPI-first checkout - paid via GPay in 2 taps. The FSSAI veg marks on every card are super helpful. Minor: wish I could save a custom address.",
    verified: true,
    helpful: 19,
    restaurant: "Multiple restaurants",
  },
  {
    id: "r4",
    name: "Karthik N.",
    initials: "K",
    colour: "#D97706",
    rating: 4,
    date: "3 weeks ago",
    title: "Gulab Jamun - worth every rupee",
    body: "Ordered Gulab Jamun from Haldiram's. 4 pieces for ₹119 is fair, and they came soaked perfectly - not too sweet. Fast 22-minute delivery. Will reorder.",
    verified: false,
    helpful: 12,
    restaurant: "Haldiram's",
  },
  {
    id: "r5",
    name: "Sneha R.",
    initials: "S",
    colour: "#0891B2",
    rating: 5,
    date: "1 month ago",
    title: "Tracking screen is excellent",
    body: "The live ETA tracking is accurate. Onboarding explained everything clearly. Dark mode works flawlessly. This is the best food app I've used on campus.",
    verified: true,
    helpful: 45,
    restaurant: "Multiple restaurants",
  },
  {
    id: "r6",
    name: "Mohammed A.",
    initials: "M",
    colour: "#BE185D",
    rating: 3,
    date: "1 month ago",
    title: "Good but Lucknowi biryani was cold",
    body: "The app experience was smooth. Unfortunately the Awadhi biryani arrived below ideal temperature. The restaurant responded quickly and offered a discount code.",
    verified: true,
    helpful: 8,
    restaurant: "Behrouz Biryani",
  },
] as const;

// Rating histogram - reflects aggregate data across 1,243 reviews
const HISTOGRAM = [
  { stars: 5, pct: 62 },
  { stars: 4, pct: 22 },
  { stars: 3, pct: 9 },
  { stars: 2, pct: 4 },
  { stars: 1, pct: 3 },
] as const;

const SORT_OPTIONS = ["Most Helpful", "Most Recent", "Rating: High to Low", "Rating: Low to High"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < rating ? "#f59e0b" : "#d1d5db" }}>
      ★
    </span>
  ));

const ReviewsScreen = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortOption>("Most Helpful");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const OVERALL = 4.5;
  const TOTAL = 1243;

  const sortedReviews = [...REVIEWS]
    .filter((r) => filterRating === null || r.rating === filterRating)
    .sort((a, b) => {
      if (sort === "Most Helpful") return b.helpful - a.helpful;
      if (sort === "Rating: High to Low") return b.rating - a.rating;
      if (sort === "Rating: Low to High") return a.rating - b.rating;
      return 0; // Most Recent keeps seed order
    });

  return (
    <div className="page-shell">
      <TopNav showSearch={false} />

      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-3 space-y-5">

        {/* ── Anchoring: large average score shown first so subsequent reviews are judged against it ── */}
        <section className="doodle-panel p-6">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">

            {/* Overall score - Cialdini Social Proof anchored by 1,243 reviews */}
            <div className="text-center">
              <p
                className="text-7xl font-black leading-none text-ink"
                aria-label={`Overall rating: ${OVERALL} out of 5`}
              >
                {OVERALL}
              </p>
              <div className="review-stars mt-1 text-2xl" aria-hidden="true">
                {renderStars(Math.round(OVERALL))}
              </div>
              <p className="mt-1 text-sm text-ink/60">
                {TOTAL.toLocaleString("en-IN")} verified reviews
              </p>
            </div>

            {/* Rating histogram - Gestalt Common Region: bars grouped in bordered section */}
            <div className="flex-1 w-full">
              {HISTOGRAM.map(({ stars, pct }) => (
                <button
                  key={stars}
                  type="button"
                  className={`flex w-full items-center gap-2 py-0.5 text-xs font-semibold transition-opacity ${
                    filterRating !== null && filterRating !== stars ? "opacity-40" : ""
                  }`}
                  onClick={() => setFilterRating(filterRating === stars ? null : stars)}
                  aria-pressed={filterRating === stars}
                  aria-label={`Filter by ${stars} stars - ${pct}%`}
                >
                  <span className="w-4 shrink-0 text-right text-ink/70">{stars}</span>
                  <span className="text-amber-500">★</span>
                  <div className="rating-histogram-bar flex-1">
                    <div
                      className="rating-histogram-fill"
                      style={{ width: `${pct}%` }}
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      role="progressbar"
                    />
                  </div>
                  <span className="w-8 shrink-0 text-ink/60">{pct}%</span>
                </button>
              ))}
              {filterRating !== null && (
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold underline"
                  style={{ color: "var(--accent)" }}
                  onClick={() => setFilterRating(null)}
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>

          {/* Cialdini trust signals */}
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              "All reviews verified via order history",
              "No anonymous or fake reviews",
              "FSSAI-certified restaurants only",
            ].map((label) => (
              <span key={label} className="flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold text-ink/80">
                <span style={{ width: "0.4rem", height: "0.4rem", borderRadius: "50%", background: "#16a34a", flexShrink: 0, display: "inline-block" }} />
                {label}
              </span>
            ))}
          </div>
        </section>

        {/* ── Sort & Filter ── */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-ink">Sort:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`filter-pill ${sort === opt ? "selected" : ""}`}
              onClick={() => setSort(opt)}
              aria-pressed={sort === opt}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* ── Review Cards ── */}
        <section className="space-y-4">
          {sortedReviews.length === 0 ? (
            <p className="text-center text-sm text-ink/60 py-8">No reviews match this filter.</p>
          ) : (
            sortedReviews.map((review) => (
              <article key={review.id} className="review-card" aria-label={`Review by ${review.name}`}>
                <div className="flex items-start gap-3">
                  {/* Gestalt Similarity: all avatars same size + circular + colour-coded */}
                  <div
                    className="review-avatar"
                    style={{ background: review.colour }}
                    aria-hidden="true"
                  >
                    {review.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-ink text-sm">{review.name}</p>
                      {review.verified && (
                        <span className="verified-badge" aria-label="Verified purchase">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="review-stars text-sm" aria-label={`${review.rating} out of 5 stars`}>
                        {renderStars(review.rating)}
                      </span>
                      <span className="text-xs text-ink/50">· {review.date}</span>
                    </div>
                    <p className="text-xs text-ink/50 mt-0.5">via {review.restaurant}</p>
                  </div>
                </div>

                <p className="mt-3 font-semibold text-ink text-sm">{review.title}</p>
                <p className="mt-1 text-sm text-ink/80 leading-relaxed">{review.body}</p>

                <div className="mt-3 flex items-center gap-3 text-xs text-ink/60">
                  <button type="button" className="hover:text-ink font-semibold transition-colors">
                    Helpful ({review.helpful})
                  </button>
                  <span>·</span>
                  <button type="button" className="hover:text-ink transition-colors">
                    Reply
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        {/* Write a review CTA - Cialdini Commitment: encourage reciprocity */}
        <section className="doodle-panel p-5 text-center">
          <h2 className="text-xl font-bold text-ink">Share your experience</h2>
          <p className="mt-1 text-sm text-ink/70">
            Your review helps other students find great food near campus.
          </p>
          <button
            type="button"
            className="doodle-primary-btn mt-4 px-8 py-3"
            onClick={() => navigate("/profile")}
          >
            Write a Review
          </button>
        </section>

      </main>
    </div>
  );
};

export default ReviewsScreen;

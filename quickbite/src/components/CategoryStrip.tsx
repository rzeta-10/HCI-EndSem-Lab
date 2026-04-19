// CategoryStrip - Hick's Law: ≤7 visible options to keep decision load in check.
// Law of Continuity: horizontal rail reads as one continuous stream.
// Gestalt Similarity: all chips share identical shape/size - one action class.
// No images or emoji - clean colored-dot + bold text for rapid category recognition.
// Serial Position Effect: Biryani (most ordered) is pinned first via menuData order.

import { foodCategories } from "../data/menuData";
import { FoodCategory } from "../types";

interface CategoryStripProps {
  selectedCategory: FoodCategory | "All";
  onSelectCategory?: (category: FoodCategory | "All") => void;
  interactive?: boolean;
}

const CategoryStrip = ({
  selectedCategory,
  onSelectCategory,
  interactive = false,
}: CategoryStripProps) => {
  const visibleCategories = foodCategories.slice(0, 7);

  return (
    <div className="category-rail" role="group" aria-label="Food categories">
      {/* "All" pill - always first (primacy) */}
      {interactive ? (
        <button
          type="button"
          onClick={() => onSelectCategory?.("All")}
          className={`category-pill ${selectedCategory === "All" ? "selected" : ""}`}
          aria-pressed={selectedCategory === "All"}
          aria-label="Show all categories"
        >
          <span
            className="category-pill-dot"
            style={{ background: selectedCategory === "All" ? "var(--accent)" : "var(--ink-soft)" }}
          />
          All
        </button>
      ) : null}

      {visibleCategories.map((category) => {
        const isSelected = selectedCategory === category.label;
        return (
          <button
            type="button"
            key={category.label}
            onClick={() => onSelectCategory?.(category.label)}
            className={`category-pill ${isSelected ? "selected" : ""} ${interactive ? "" : "cursor-default"}`}
            aria-pressed={isSelected}
            aria-label={`Browse ${category.label}`}
            style={isSelected ? undefined : { background: category.tint }}
          >
            <span
              className="category-pill-dot"
              style={{ background: isSelected ? "var(--accent)" : category.dot }}
            />
            {category.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryStrip;

import { SearchFilters, SearchPriceBand } from "../types";

interface FilterBarProps {
  filters: SearchFilters;
  onUpdate: (updates: Partial<SearchFilters>) => void;
  onReset: () => void;
}

const priceOptions: Array<{ label: string; value: SearchPriceBand }> = [
  { label: "Under ₹200", value: "Under200" },
  { label: "₹200 - ₹300", value: "200to300" },
  { label: "Above ₹300", value: "Above300" },
];

const prepOptions: Array<{ label: string; value: number | null }> = [
  { label: "<= 25 min", value: 25 },
  { label: "<= 20 min", value: 20 },
];

const FilterBar = ({ filters, onUpdate, onReset }: FilterBarProps) => {
  return (
    <section className="doodle-panel bg-[var(--surface)] p-4" aria-label="Search filters">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-ink">Filters</h2>
        <button type="button" className="doodle-secondary-btn" onClick={onReset} aria-label="Reset all filters">
          Reset
        </button>
      </div>

      <div className="space-y-3">
        {/* Miller's Law (7±2): this panel intentionally exposes only seven direct filter choices to avoid memory overload. */}
        <button
          type="button"
          className={`filter-pill ${filters.vegOnly ? "selected" : ""}`}
          onClick={() => onUpdate({ vegOnly: !filters.vegOnly })}
          aria-pressed={filters.vegOnly}
        >
          Veg Only
        </button>

        <div className="flex flex-wrap gap-2">
          {priceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`filter-pill ${filters.priceBand === option.value ? "selected" : ""}`}
              onClick={() => onUpdate({ priceBand: option.value })}
              aria-pressed={filters.priceBand === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {prepOptions.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              className={`filter-pill ${filters.maxPrepMinutes === option.value ? "selected" : ""}`}
              onClick={() => onUpdate({ maxPrepMinutes: option.value })}
              aria-pressed={filters.maxPrepMinutes === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`filter-pill ${filters.ratingAtLeastFour ? "selected" : ""}`}
          onClick={() => onUpdate({ ratingAtLeastFour: !filters.ratingAtLeastFour })}
          aria-pressed={filters.ratingAtLeastFour}
        >
          Rating 4.0+
        </button>
      </div>
    </section>
  );
};

export default FilterBar;

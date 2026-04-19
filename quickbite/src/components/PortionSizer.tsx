import { useMemo, useState } from "react";

const portions = [
  { key: 1, label: "Medium", slices: 4, servings: "1-2" },
  { key: 2, label: "Large", slices: 6, servings: "2-3" },
  { key: 3, label: "Party", slices: 8, servings: "3-4" },
] as const;

const PortionSizer = () => {
  const [sizeLevel, setSizeLevel] = useState(2);

  const current = useMemo(
    () => portions.find((portion) => portion.key === sizeLevel) ?? portions[1],
    [sizeLevel]
  );

  return (
    <aside className="doodle-panel portion-sizer p-4" aria-label="Visual portion sizer">
      <h3 className="text-2xl font-bold text-ink">Portion Sizer</h3>
      <p className="text-sm text-ink/80">Pick a size - slices show how much you get.</p>

      <label htmlFor="portion-slider" className="mt-3 block text-sm font-semibold text-ink">
        Portion Size: {current.label}
      </label>
      <input
        id="portion-slider"
        type="range"
        min={1}
        max={3}
        step={1}
        value={sizeLevel}
        onChange={(event) => setSizeLevel(Number(event.target.value))}
        className="portion-slider mt-2"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={sizeLevel}
        aria-valuetext={current.label}
      />
      <div className="mt-2 flex items-center justify-between text-xs font-semibold text-ink/70">
        {portions.map((portion) => (
          <span key={portion.key} className={portion.key === sizeLevel ? "text-ink" : ""}>
            {portion.label}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-col items-center gap-2" aria-live="polite">
        <div className="flex flex-wrap justify-center gap-1.5" role="img" aria-label={`${current.slices} slices for ${current.label} size`}>
          {Array.from({ length: current.slices }).map((_, i) => (
            <span
              key={i}
              style={{
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "50%",
                background: "var(--accent)",
                display: "inline-block",
                opacity: 0.8 + (i / (current.slices - 1 || 1)) * 0.2,
              }}
            />
          ))}
        </div>
        <p className="text-sm font-semibold text-ink/70">{current.slices} slices</p>
      </div>

      <p className="portion-note mt-3 rounded-lg px-3 py-2 text-sm font-semibold text-ink">
        Estimated servings: {current.servings} people
      </p>
    </aside>
  );
};

export default PortionSizer;


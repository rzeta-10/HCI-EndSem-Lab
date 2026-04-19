// TrackingBar - Inverted Pyramid: ETA → status → step detail (most → least critical).
// Determinate stepped tracker reduces delivery anxiety (§4.14 Wait-time UX).
// Gestalt Closure: connector line between dots - brain completes the pipeline (IBM logo ref).
// Progress animated start-slow / end-fast via spring cubic-bezier (§4.14 course finding).
// Nielsen H1 - Visibility of System Status: user knows exact delivery stage at all times.
// Icons replaced with SVG icon components - no emoji, clean editorial look.

import { TrackingStage } from "../types";
import { CheckIcon, ClockIcon, PackageIcon, TruckIcon } from "./Icons";

const STAGES: {
  stage: TrackingStage;
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
}[] = [
  { stage: "Order Received",   Icon: PackageIcon, label: "Received" },
  { stage: "Food Cooking",     Icon: ClockIcon,   label: "Cooking" },
  { stage: "Out for Delivery", Icon: TruckIcon,   label: "On the way" },
];

interface TrackingBarProps {
  currentStage: TrackingStage | null;
}

const TrackingBar = ({ currentStage }: TrackingBarProps) => {
  if (!currentStage) return null;

  const activeIndex = STAGES.findIndex((s) => s.stage === currentStage);
  const progress = (activeIndex / (STAGES.length - 1)) * 100;

  return (
    <section className="doodle-panel p-4 sm:p-5" aria-label="Order tracking progress">
      <h3 className="text-xl font-bold text-ink">Order Tracking</h3>
      <p className="mt-0.5 text-sm" style={{ color: "var(--ink-soft)" }}>
        Status:{" "}
        <strong style={{ color: "var(--accent-strong)" }}>{currentStage}</strong>
      </p>

      {/* ── Stepped progress ── */}
      <div className="relative mt-7" role="none">
        {/* Background track */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: "0.72rem",
            height: "3px",
            borderRadius: "999px",
            background: "var(--line)",
          }}
        />
        {/* Filled portion - spring easing for perceived speed */}
        <div
          className="absolute left-0"
          style={{
            top: "0.72rem",
            height: "3px",
            borderRadius: "999px",
            width: `${progress}%`,
            background: "linear-gradient(90deg, var(--accent), #f59e0b)",
            transition: "width 700ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          role="progressbar"
          aria-label="Order progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        />

        {/* Stage columns */}
        <div className="relative flex justify-between">
          {STAGES.map(({ stage, Icon, label }, i) => {
            const isDone = i <= activeIndex;
            const isActive = i === activeIndex;

            return (
              <div key={stage} className="flex flex-1 flex-col items-center gap-2">
                {/* Step dot */}
                <div
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    borderRadius: "50%",
                    border: `2px solid ${isDone ? "var(--accent)" : "var(--line)"}`,
                    background: isDone ? "var(--accent)" : "var(--surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isDone ? "#fff" : "var(--ink-soft)",
                    transition: "all 400ms ease",
                    boxShadow: isActive ? "0 0 0 4px rgba(249,115,22,0.18)" : "none",
                    zIndex: 1,
                    position: "relative",
                  }}
                  aria-label={isDone ? `${label} - complete` : label}
                >
                  {isDone ? <CheckIcon size={10} /> : null}
                </div>

                {/* Icon below dot */}
                <Icon
                  size={16}
                  style={{ color: isDone ? "var(--accent-strong)" : "var(--ink-soft)" }}
                />

                {/* Label */}
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: isDone ? 700 : 500,
                    color: isDone ? "var(--accent-strong)" : "var(--ink-soft)",
                    textAlign: "center",
                    lineHeight: 1.3,
                    transition: "color 300ms ease",
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrackingBar;

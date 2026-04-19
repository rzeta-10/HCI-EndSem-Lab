// FSSAI-mandated veg / egg / non-veg indicator (square border + inner symbol).
// Equitable Use (Universal Design): colour + shape both carry meaning for colour-blind users.

interface VegMarkProps {
  isVeg: boolean;
  isEgg?: boolean;
  size?: number;
  className?: string;
}

const VegMark = ({ isVeg, isEgg = false, size = 14, className = "" }: VegMarkProps) => {
  const borderColor = isVeg ? "#0C8B51" : isEgg ? "#D89B0D" : "#C8102E";
  const fillColor = borderColor;
  const label = isVeg ? "Vegetarian" : isEgg ? "Contains Egg" : "Non-Vegetarian";

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 2,
      }}
    >
      {isVeg ? (
        // FSSAI veg: filled circle
        <span
          style={{
            width: Math.round(size * 0.44),
            height: Math.round(size * 0.44),
            borderRadius: "50%",
            background: fillColor,
          }}
        />
      ) : (
        // FSSAI egg & non-veg: upward-pointing triangle
        <span
          style={{
            width: 0,
            height: 0,
            borderLeft: `${Math.round(size * 0.28)}px solid transparent`,
            borderRight: `${Math.round(size * 0.28)}px solid transparent`,
            borderBottom: `${Math.round(size * 0.42)}px solid ${fillColor}`,
          }}
        />
      )}
    </span>
  );
};

export default VegMark;

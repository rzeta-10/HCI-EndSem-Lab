// BottomNav - Serial Position Effect: Home (primacy) and Help (recency) most recalled.
// Fitts's Law: ≥56px touch targets, thumb-reachable on mobile.
// Jakob's Law: mirrors Swiggy/Zomato bottom-nav mental model.
// All icons are inline SVGs - no emoji, theme-aware via currentColor.

import { Link, useLocation } from "react-router-dom";
import { useQuickBite } from "../context/QuickBiteContext";
import { CartIcon, HelpCircleIcon, HomeIcon, SearchIcon, UserIcon } from "./Icons";

const NAV_ITEMS = [
  { path: "/",         Icon: HomeIcon,        label: "Home" },
  { path: "/search",   Icon: SearchIcon,      label: "Search" },
  { path: "/checkout", Icon: CartIcon,        label: "Cart" },
  { path: "/profile",  Icon: UserIcon,        label: "Profile" },
  { path: "/help",     Icon: HelpCircleIcon,  label: "Help" },
] as const;

const BottomNav = () => {
  const location = useLocation();
  const { cartCount } = useQuickBite();

  return (
    <nav className="bottom-nav-bar" aria-label="Main navigation">
      {NAV_ITEMS.map(({ path, Icon, label }) => {
        const isActive = location.pathname === path;
        const showBadge = label === "Cart" && cartCount > 0;

        return (
          <Link
            key={path}
            to={path}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="bottom-nav-icon" style={{ position: "relative" }}>
              <Icon size={22} />
              {showBadge ? (
                <span className="bottom-nav-badge" aria-label={`${cartCount} items in cart`}>
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              ) : null}
            </span>
            <span className="bottom-nav-label">{label}</span>
            {isActive ? <span className="bottom-nav-indicator" aria-hidden="true" /> : null}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;

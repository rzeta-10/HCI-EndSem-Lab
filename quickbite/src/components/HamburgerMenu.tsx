// HamburgerMenu - Shneiderman Rule 7: user control via overlay dismiss + close button.
// Miller's Law: primary nav 5 items; secondary nav grouped separately (chunking).
// Icon + label pairs always - never icon-only (glass-door anti-pattern from class).
// Figure-Ground: backdrop dims content to isolate drawer as foreground.
// All icons are inline SVGs - no CDN, theme-aware via currentColor.

import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuickBite } from "../context/QuickBiteContext";
import {
  AccessibilityIcon,
  BookOpenIcon,
  CartIcon,
  ClockIcon,
  CloseIcon,
  HelpCircleIcon,
  HomeIcon,
  MapPinIcon,
  SearchIcon,
  ShieldIcon,
  StarIcon,
  TruckIcon,
  UserIcon,
} from "./Icons";

const HamburgerMenu = () => {
  const { state, cartCount, closeHamburger, setLoggedIn } = useQuickBite();
  const location = useLocation();

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (state.isHamburgerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [state.isHamburgerOpen]);

  if (!state.isHamburgerOpen) return null;

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
      isActive(path)
        ? "text-[var(--accent-strong)]"
        : "text-[var(--ink)] hover:bg-[var(--surface-muted)]"
    }`;

  const activeStyle = (path: string): React.CSSProperties =>
    isActive(path) ? { background: "rgba(249,115,22,0.08)" } : {};

  return (
    <>
      {/* Backdrop - Figure-Ground: dims content behind drawer */}
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        aria-label="Close navigation menu"
        onClick={closeHamburger}
        tabIndex={-1}
      />

      <aside
        className="hamburger-drawer fixed left-0 top-0 z-50 flex h-full w-[17rem] max-w-[88vw] flex-col bg-[var(--surface)]"
        aria-label="Navigation menu"
        aria-modal="true"
        role="dialog"
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          {/* Brand mark - icon + wordmark */}
          <div className="flex items-center gap-2">
            <img src="/assets/logo.svg" alt="" aria-hidden="true" style={{ height: "32px", width: "32px" }} />
            <span style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--accent)" }}>
              Quick<span style={{ color: "var(--ink)" }}>Bite</span>
            </span>
          </div>
          <button
            type="button"
            onClick={closeHamburger}
            className="doodle-icon-button"
            aria-label="Close navigation menu"
          >
            <CloseIcon size={17} />
          </button>
        </div>

        {/* ── Primary navigation (Miller: 5 items) ── */}
        <nav className="flex flex-col gap-0.5 px-3 pt-4" aria-label="Primary navigation">
          <Link to="/" onClick={closeHamburger} className={navLinkClass("/")} style={activeStyle("/")}>
            <HomeIcon size={17} />
            Home
          </Link>
          <Link to="/menu" onClick={closeHamburger} className={navLinkClass("/menu")} style={activeStyle("/menu")}>
            <BookOpenIcon size={17} />
            Menu
          </Link>
          <Link to="/search" onClick={closeHamburger} className={navLinkClass("/search")} style={activeStyle("/search")}>
            <SearchIcon size={17} />
            Search
          </Link>
          <Link to="/checkout" onClick={closeHamburger} className={navLinkClass("/checkout")} style={activeStyle("/checkout")}>
            <CartIcon size={17} />
            <span>Cart</span>
            {cartCount > 0 ? (
              <span
                className="ml-auto rounded-full px-2 py-0.5 text-xs font-bold text-white"
                style={{ background: "var(--accent)", fontSize: "0.68rem" }}
              >
                {cartCount}
              </span>
            ) : null}
          </Link>
          <Link to="/tracking" onClick={closeHamburger} className={navLinkClass("/tracking")} style={activeStyle("/tracking")}>
            <TruckIcon size={17} />
            Order Tracking
          </Link>
        </nav>

        <div className="mx-4 my-3" style={{ borderTop: "1px solid var(--line)" }} />

        {/* ── Secondary navigation ── */}
        <nav className="flex flex-col gap-0.5 px-3" aria-label="Secondary navigation">
          <p
            className="mb-1 px-3 text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--ink-soft)" }}
          >
            Account
          </p>
          <Link to="/profile" onClick={closeHamburger} className={navLinkClass("/profile")} style={activeStyle("/profile")}>
            <UserIcon size={17} />
            Profile &amp; History
          </Link>
          <Link to="/accessibility" onClick={closeHamburger} className={navLinkClass("/accessibility")} style={activeStyle("/accessibility")}>
            <AccessibilityIcon size={17} />
            Accessibility
          </Link>
          <Link to="/reviews" onClick={closeHamburger} className={navLinkClass("/reviews")} style={activeStyle("/reviews")}>
            <StarIcon size={17} />
            Reviews
          </Link>
          <Link to="/help" onClick={closeHamburger} className={navLinkClass("/help")} style={activeStyle("/help")}>
            <HelpCircleIcon size={17} />
            Help &amp; Support
          </Link>
          
          <div className="mx-4 my-2" style={{ borderTop: "1px solid var(--line)" }} />
          
          {state.isLoggedIn ? (
            <button
              onClick={() => {
                setLoggedIn(false);
                closeHamburger();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 text-ink/70"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={closeHamburger}
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] hover:text-[var(--accent-strong)] text-ink/70"
            >
              Login / Sign Up
            </Link>
          )}
        </nav>

        {/* ── Footer trust signals ── */}
        <div
          className="mt-auto px-5 py-4"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>
            <ShieldIcon size={13} style={{ color: "#16a34a" }} />
            FSSAI Certified
            <span style={{ color: "var(--line)" }}>·</span>
            <MapPinIcon size={13} />
            Chennai
          </div>
          <p className="mt-1 text-xs" style={{ color: "var(--ink-soft)", opacity: 0.6 }}>
            Delivering near IIITDM Kancheepuram
          </p>
        </div>
      </aside>
    </>
  );
};

export default HamburgerMenu;

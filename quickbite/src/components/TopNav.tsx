// TopNav - Jakob's Law: search at top mirrors Zomato/Swiggy mental model.
// Locus of Attention: cart toast appears adjacent to cart button.
// Zomato-style location chip: "Delivering to · IIITDM Campus" as tappable affordance.
// Fitts's Law: cart + hamburger ≥44px targets, grouped at edges for thumb reach.

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuickBite } from "../context/QuickBiteContext";
import { savedAddresses } from "../data/menuData";
import {
  CartIcon,
  ChevronDownIcon,
  MapPinIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  MicIcon,
} from "./Icons";

interface TopNavProps {
  showSearch?: boolean;
}

const TopNav = ({ showSearch = true }: TopNavProps) => {
  const { state, setSearchTerm, cartCount, toggleHamburger, isDarkMode, toggleDarkMode } =
    useQuickBite();
  const location = useLocation();
  const [cartPulse, setCartPulse] = useState(false);
  const [showCartToast, setShowCartToast] = useState(false);
  const [showAddressMenu, setShowAddressMenu] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);
  const [isListening, setIsListening] = useState(false);

  const startVoiceSearch = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const prevCartCountRef = useRef(cartCount);
  const pulseTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const addressMenuRef = useRef<HTMLDivElement>(null);

  // Close address dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (addressMenuRef.current && !addressMenuRef.current.contains(e.target as Node)) {
        setShowAddressMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const previous = prevCartCountRef.current;
    if (cartCount === previous) return;
    setCartPulse(true);
    if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = window.setTimeout(() => setCartPulse(false), 420);
    if (cartCount > previous) {
      setShowCartToast(true);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = window.setTimeout(() => setShowCartToast(false), 1400);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  // Short label for the chip - use tag label (Home / Office / Mom's Place)
  const chipLabel = selectedAddress.label;

  return (
    <header className="sticky top-0 z-40 px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="doodle-panel mx-auto max-w-6xl px-3 py-2.5 sm:px-4" style={{ borderRadius: "18px" }}>

        {/* ── Row 1: hamburger · brand · location chip · dark-toggle · cart ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleHamburger}
            className="doodle-icon-button flex-shrink-0"
            aria-label="Open navigation menu"
          >
            <MenuIcon size={18} />
          </button>

          {/* Brand mark - icon + wordmark */}
          <Link to="/" className="flex flex-shrink-0 items-center gap-2" aria-label="QuickBite home">
            <img src="/assets/logo.svg" alt="" aria-hidden="true" style={{ height: "32px", width: "32px" }} />
            <span style={{ fontSize: "1.25rem", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--accent)" }}>
              Quick<span style={{ color: "var(--ink)" }}>Bite</span>
            </span>
          </Link>

          {/* Address dropdown chip */}
          <div className="relative hidden sm:block" ref={addressMenuRef}>
            <button
              type="button"
              className="location-chip"
              aria-label={`Change delivery address - currently ${selectedAddress.label}`}
              aria-expanded={showAddressMenu}
              aria-haspopup="listbox"
              onClick={() => setShowAddressMenu((v) => !v)}
            >
              <MapPinIcon size={11} style={{ color: "var(--accent)", flexShrink: 0 }} />
              <span className="location-chip-label">Delivering to</span>
              <span className="truncate text-xs font-bold text-ink">
                {chipLabel}
              </span>
              <ChevronDownIcon
                size={12}
                style={{
                  color: "var(--accent)",
                  flexShrink: 0,
                  transform: showAddressMenu ? "rotate(180deg)" : "none",
                  transition: "transform 0.18s ease",
                }}
              />
            </button>

            {/* Dropdown */}
            {showAddressMenu && (
              <div
                className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border bg-[var(--surface)] py-1.5 shadow-lg"
                style={{ borderColor: "var(--line)" }}
                role="listbox"
                aria-label="Saved addresses"
              >
                <p className="px-4 pb-1 pt-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--ink-soft)" }}>
                  Saved addresses
                </p>
                {savedAddresses.map((addr) => {
                  const isSelected = addr.id === selectedAddress.id;
                  const dot = addr.label === "Home" ? "#16a34a" : addr.label === "Office" ? "#2563eb" : "#f97316";
                  return (
                    <button
                      key={addr.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[var(--surface-muted)]"
                      style={isSelected ? { background: "rgba(249,115,22,0.07)" } : {}}
                      onClick={() => { setSelectedAddress(addr); setShowAddressMenu(false); }}
                    >
                      <span
                        className="mt-0.5 flex-shrink-0 rounded-full"
                        style={{ width: 8, height: 8, background: dot, marginTop: 5 }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink">{addr.label}</p>
                        <p className="truncate text-xs" style={{ color: "var(--ink-soft)" }}>{addr.address}</p>
                        {addr.landmark && (
                          <p className="text-xs italic" style={{ color: "var(--ink-soft)", opacity: 0.7 }}>
                            {addr.landmark}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <span className="ml-auto text-xs font-bold" style={{ color: "var(--accent)" }}>✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex-1" />

          <button
            type="button"
            onClick={toggleDarkMode}
            className={`doodle-icon-button flex-shrink-0 ${isDarkMode ? "dark-on" : ""}`}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDarkMode}
          >
            {isDarkMode ? <SunIcon size={17} /> : <MoonIcon size={17} />}
          </button>

          {/* Cart - right-edge placement for Fitts's Law */}
          <div className="relative flex-shrink-0">
            <Link
              to="/checkout"
              className={`doodle-cart ${location.pathname === "/checkout" ? "active" : ""} ${cartPulse ? "cart-bump" : ""}`}
              aria-label={`Cart - ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
              id="quickbite-cart-link"
            >
              <CartIcon size={18} />
              <span className="hidden font-semibold sm:inline">Cart</span>
              <span className={`doodle-badge ${cartPulse ? "badge-pop" : ""}`} aria-live="polite">
                {cartCount}
              </span>
            </Link>
            {showCartToast && (
              <div className="cart-toast" role="status" aria-live="polite">
                Cart updated ({cartCount})
              </div>
            )}
          </div>
        </div>

        {/* ── Row 2: mobile location chip + search bar ── */}
        {showSearch && (
          <div className="mt-2.5 flex items-center gap-2">
            {/* Mobile-only address chip */}
            <div className="relative sm:hidden" ref={undefined}>
              <button
                type="button"
                className="location-chip flex-shrink-0"
                aria-label="Change delivery address"
                onClick={() => setShowAddressMenu((v) => !v)}
              >
                <MapPinIcon size={10} style={{ color: "var(--accent)" }} />
                <span className="text-xs font-bold text-ink">{chipLabel}</span>
                <ChevronDownIcon size={11} style={{ color: "var(--accent)" }} />
              </button>
            </div>

            <div className="relative flex-1">
              <SearchIcon
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--ink-soft)" }}
              />
              <label className="sr-only" htmlFor="quickbite-search">
                Search food, cuisines, or restaurants
              </label>
              <input
                id="quickbite-search"
                value={state.searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search food, cuisines, restaurants…"
                className="doodle-input"
                style={{ paddingLeft: "2.25rem" }}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={startVoiceSearch}
                aria-label="Voice search"
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
                  isListening ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse" : "text-ink/60 hover:text-ink hover:bg-[var(--surface-muted)]"
                }`}
              >
                <MicIcon size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNav;

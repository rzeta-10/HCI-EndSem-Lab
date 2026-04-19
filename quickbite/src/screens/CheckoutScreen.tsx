// CheckoutScreen - all 8 Shneiderman Golden Rules + Nielsen Heuristics demonstrated.
// Jakob's Law: UPI-first payment mirrors GPay/PhonePe/Paytm mental model for Indian users.
// Tesler's Law: automated price + tax computation removes irreducible complexity from user.
// Postel's Law: flexible address input (saved labels or freeform); strict total calculation.

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartItemRow from "../components/CartItemRow";
import OrderSuccessModal from "../components/OrderSuccessModal";
import TopNav from "../components/TopNav";
import TrackingBar from "../components/TrackingBar";
import VegMark from "../components/VegMark";
import { useQuickBite } from "../context/QuickBiteContext";
import { savedAddresses } from "../data/menuData";
import { CartLine, PaymentMethod, UpiApp } from "../types";

// Jakob's Law: real payment app logos aid instant recognition - no initials needed.
const UPI_APPS: { id: UpiApp; label: string; logoSrc: string; logoBg: string }[] = [
  { id: "gpay",    label: "GPay",    logoSrc: "/assets/payment/gpay.svg",     logoBg: "#fff" },
  { id: "phonepe", label: "PhonePe", logoSrc: "/assets/payment/phonepe.png",  logoBg: "transparent" },
  { id: "paytm",   label: "Paytm",   logoSrc: "/assets/payment/paytm.png",    logoBg: "transparent" },
  { id: "bhim",    label: "BHIM",    logoSrc: "/assets/payment/bhim.png",     logoBg: "transparent" },
];

const CheckoutScreen = () => {
  const navigate = useNavigate();
  const {
    state,
    cartCount,
    priceBreakdown,
    incrementItem,
    decrementItem,
    removeLine,
    restoreLine,
    setCheckoutField,
    setOrderModalOpen,
    setTrackingStage,
    clearCart,
    placeOrderAndRecordHistory,
  } = useQuickBite();

  const [undoLine, setUndoLine] = useState<CartLine | null>(null);
  const [formError, setFormError] = useState<string>("");
  const [selectedUpiApp, setSelectedUpiApp] = useState<UpiApp>("gpay");

  const undoTimerRef = useRef<number | null>(null);
  const trackingTimersRef = useRef<number[]>([]);

  const clearUndoTimer = () => {
    if (undoTimerRef.current) {
      window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
  };

  const clearTrackingTimers = () => {
    trackingTimersRef.current.forEach((t) => window.clearTimeout(t));
    trackingTimersRef.current = [];
  };

  useEffect(() => () => { clearUndoTimer(); clearTrackingTimers(); }, []);

  const handleRemove = (itemId: string) => {
    const line = state.cart.find((entry) => entry.item.id === itemId);
    if (!line) return;
    removeLine(itemId);
    setUndoLine(line);
    clearUndoTimer();
    // Shneiderman: Easy Reversal of Actions - 5-second undo window
    undoTimerRef.current = window.setTimeout(() => {
      setUndoLine(null);
      undoTimerRef.current = null;
    }, 5000);
  };

  const handleUndo = () => {
    if (!undoLine) return;
    restoreLine(undoLine);
    setUndoLine(null);
    clearUndoTimer();
  };

  const [paymentFailed, setPaymentFailed] = useState<boolean>(false);

  const handlePlaceOrder = () => {
    if (cartCount === 0) { setFormError("Your cart is empty."); return; }
    if (state.checkoutForm.address.trim().length < 8) {
      setFormError("Please enter a complete delivery address.");
      return;
    }

    // HCI: Asimov Law 1 - Prevent harm. Protect user from unexpected large cash requirement.
    if (state.checkoutForm.paymentMethod === "COD" && priceBreakdown.total > 2000) {
      if (!window.confirm(`Warning: Your COD order is ₹${priceBreakdown.total}. Please ensure you have exact change available. Do you want to proceed?`)) {
        return;
      }
    }

    // HCI: Robustness - Retry-on-payment-fail simulation (10% chance to fail online payment)
    if (state.checkoutForm.paymentMethod !== "COD" && !paymentFailed && Math.random() > 0.9) {
      setPaymentFailed(true);
      setFormError("Payment timed out. Please try again or switch your payment method to Cash on Delivery.");
      return;
    }

    setPaymentFailed(false);
    setFormError("");
    placeOrderAndRecordHistory();
    setOrderModalOpen(true);
    setTrackingStage("Order Received");
    clearTrackingTimers();
    // Shneiderman: Visibility of System Status - auto-advance tracking stages
    const t1 = window.setTimeout(() => setTrackingStage("Food Cooking"), 2500);
    const t2 = window.setTimeout(() => setTrackingStage("Out for Delivery"), 5000);
    trackingTimersRef.current = [t1, t2];
    clearCart();
  };

  // Detect if cart contains only veg items for a gentle persuasion nudge
  const allVeg = state.cart.every((line) => line.item.isVeg);

  return (
    <div className="page-shell">
      <TopNav showSearch={false} />

      <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 pb-36 pt-3 lg:grid-cols-[1.2fr_0.8fr]">

        {/* ── LEFT: Cart Items ── */}
        <section className="doodle-panel p-5">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-ink">Cart & Checkout</h1>
            <div className="flex items-center gap-3">
              {state.cart.length > 0 && (
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out my QuickBite order: ${state.cart.map(c => `${c.quantity}x ${c.item.name}`).join(', ')}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="doodle-secondary-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-green-600 dark:text-green-400"
                  title="Share Cart via WhatsApp"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  Share Cart
                </a>
              )}
              {allVeg && state.cart.length > 0 && (
                <span className="flex items-center gap-1.5 rounded-lg border border-[#0C8B51]/30 bg-[#0C8B51]/08 px-2.5 py-1 text-xs font-semibold text-[#0C8B51]">
                  <VegMark isVeg size={12} />
                  All Veg Order
                </span>
              )}
            </div>
          </div>

          {/* Shneiderman: Easy Reversal - undo notification with countdown context */}
          {undoLine && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="text-sm font-semibold text-ink">
                Removed {undoLine.item.name}. Undo available for 5 s.
              </p>
              <button type="button" className="doodle-secondary-btn" onClick={handleUndo}>
                Undo Remove
              </button>
            </div>
          )}

          <div className="mt-5 space-y-3">
            {state.cart.length === 0 ? (
              <div className="rounded-xl border p-6 text-center" style={{ borderColor: "var(--line)", background: "var(--surface-muted)" }}>
                <p className="text-2xl font-bold text-ink">Your cart is empty</p>
                <p className="mt-2 text-sm text-ink/75">Pick something from the menu.</p>
                <Link to="/menu" className="doodle-primary-btn mt-4 inline-flex px-6 py-3">
                  Browse Menu
                </Link>
              </div>
            ) : (
              state.cart.map((line) => (
                <CartItemRow
                  key={line.item.id}
                  line={line}
                  onIncrement={incrementItem}
                  onDecrement={decrementItem}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>
        </section>

        {/* ── RIGHT: Delivery + Payment + Bill ── */}
        <section className="space-y-5">

          {/* ── Delivery Address - Postel's Law: flexible (saved labels OR freeform) ── */}
          <div className="doodle-panel p-5">
            <h2 className="text-2xl font-bold text-ink">Delivery Address</h2>
            <p className="mt-0.5 text-xs text-ink/60">Landmark-based Indian addresses supported</p>

            <div className="mt-3 grid gap-2">
              {savedAddresses.map((addr) => {
                const isSelected = state.checkoutForm.address === addr.address;
                const labelDot = addr.label === "Home" ? "#16a34a" : addr.label === "Office" ? "#2563eb" : "#f97316";
                return (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                      isSelected
                        ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                        : "border-[var(--line)] bg-[var(--surface)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="saved-address"
                      value={addr.address}
                      checked={isSelected}
                      onChange={() => setCheckoutField("address", addr.address)}
                      className="mt-0.5"
                      aria-label={`Deliver to ${addr.label}`}
                    />
                    <div className="min-w-0">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
                        <span style={{ width: "0.4rem", height: "0.4rem", borderRadius: "50%", background: labelDot, flexShrink: 0, display: "inline-block" }} />
                        {addr.label}
                      </span>
                      <p className="text-xs text-ink/70 truncate">{addr.address}</p>
                      {addr.landmark && (
                        <p className="text-xs text-ink/55">{addr.landmark}</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-semibold text-ink/70 hover:text-ink">
                + Enter a different address
              </summary>
              <div className="mt-3 space-y-3">
                <input
                  type="text"
                  placeholder="House/Flat no., Building *"
                  className="doodle-input"
                  onChange={(e) => setCheckoutField("address", `${e.target.value}, ${state.checkoutForm.address.split(',').slice(1).join(',')}`)}
                />
                <input
                  type="text"
                  placeholder="Area/Locality *"
                  className="doodle-input"
                  onChange={(e) => setCheckoutField("address", `${state.checkoutForm.address.split(',')[0]}, ${e.target.value}, ${state.checkoutForm.address.split(',').slice(2).join(',')}`)}
                />
                <input
                  type="text"
                  placeholder="Landmark (Mandatory) *"
                  className="doodle-input border-amber-300 focus:border-amber-500 bg-amber-50 dark:bg-amber-900/10"
                  onChange={(e) => setCheckoutField("address", `${state.checkoutForm.address.split(',').slice(0, 2).join(',')}, ${e.target.value}, ${state.checkoutForm.address.split(',').slice(3).join(',')}`)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City *"
                    defaultValue="Chennai"
                    className="doodle-input"
                  />
                  <input
                    type="text"
                    placeholder="PIN Code (6 digits) *"
                    maxLength={6}
                    className="doodle-input"
                  />
                </div>
              </div>
              <p id="address-hint" className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                Landmark is crucial for faster delivery in Indian cities.
              </p>
            </details>
          </div>

          {/* ── Payment - UPI first (Jakob's Law: Indian users default to UPI) ── */}
          <div className="doodle-panel p-5">
            <h2 className="text-2xl font-bold text-ink">Payment</h2>
            <p className="mt-0.5 text-xs text-ink/60">UPI is instant, free, and secure</p>

            <div className="mt-3 grid gap-2">
              {/* UPI option - always shown first */}
              <label
                className={`flex cursor-pointer flex-col gap-2 rounded-xl border px-3 py-3 transition-colors ${
                  state.checkoutForm.paymentMethod === "UPI"
                    ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]"
                    : "border-[var(--line)] bg-[var(--surface)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment-method"
                    value="UPI"
                    checked={state.checkoutForm.paymentMethod === "UPI"}
                    onChange={() => setCheckoutField("paymentMethod", "UPI")}
                    aria-label="Pay via UPI"
                  />
                  <span className="font-bold text-ink">UPI</span>
                  <span className="ml-auto text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded px-1.5 py-0.5">
                    Recommended
                  </span>
                </div>

                {/* UPI app selector - only shows when UPI is selected */}
                {state.checkoutForm.paymentMethod === "UPI" && (
                  <div className="upi-app-grid" role="group" aria-label="Choose UPI app">
                    {UPI_APPS.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        className={`upi-app-btn ${selectedUpiApp === app.id ? "selected" : ""}`}
                        onClick={() => setSelectedUpiApp(app.id)}
                        aria-pressed={selectedUpiApp === app.id}
                        aria-label={app.label}
                      >
                        <span
                          className="upi-app-icon"
                          style={{ background: app.logoBg, padding: "2px" }}
                          aria-hidden="true"
                        >
                          {app.logoSrc ? (
                            <img src={app.logoSrc} alt={app.label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                          ) : (
                            <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#fff" }}>B</span>
                          )}
                        </span>
                        <span>{app.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </label>

              {(["Card", "COD"] as PaymentMethod[]).map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 ${
                    state.checkoutForm.paymentMethod === method
                      ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                      : "border-[var(--line)] bg-[var(--surface)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={method}
                    checked={state.checkoutForm.paymentMethod === method}
                    onChange={(e) => setCheckoutField("paymentMethod", e.target.value as PaymentMethod)}
                    aria-label={`Pay via ${method}`}
                  />
                  <span className="font-semibold text-ink">
                    {method === "Card" ? "Credit / Debit Card" : "Cash on Delivery"}
                  </span>
                </label>
              ))}
            </div>

            {formError && (
              <p className="mt-3 text-sm font-semibold text-red-700" role="alert">{formError}</p>
            )}
          </div>

          {/* ── Support & Donations (Persuasion: Reciprocity / Liking) ── */}
          <div className="doodle-panel p-5">
            <h2 className="text-xl font-bold text-ink">Support & Community</h2>
            
            <div className="mt-4 flex flex-col gap-4">
              {/* Tip to Delivery Partner */}
              <div>
                <p className="text-sm font-semibold text-ink/80 mb-2">Tip your delivery partner</p>
                <div className="flex gap-2 overflow-x-auto pb-1" role="radiogroup" aria-label="Tip amount">
                  {[0, 10, 20, 30, 50].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      role="radio"
                      aria-checked={state.checkoutForm.tipAmount === amt}
                      onClick={() => setCheckoutField("tipAmount", amt)}
                      className={`flex-shrink-0 rounded-full border px-4 py-1.5 text-sm font-bold transition-colors ${
                        state.checkoutForm.tipAmount === amt
                          ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                          : "border-[var(--line)] bg-[var(--surface-muted)] text-ink/70 hover:border-[var(--ink-soft)]"
                      }`}
                    >
                      {amt === 0 ? "No tip" : `₹${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pay-it-forward meal donation toggle */}
              <div 
                className="flex items-start gap-3 rounded-xl border p-3 transition-colors cursor-pointer"
                style={{
                  borderColor: state.checkoutForm.payItForward ? "var(--accent)" : "var(--line)",
                  backgroundColor: state.checkoutForm.payItForward ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "var(--surface-muted)"
                }}
                onClick={() => setCheckoutField("payItForward", !state.checkoutForm.payItForward)}
              >
                <input
                  type="checkbox"
                  id="payItForward"
                  checked={state.checkoutForm.payItForward}
                  onChange={(e) => setCheckoutField("payItForward", e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-0.5 h-4 w-4 rounded border-[var(--line)]"
                  style={{ accentColor: "var(--accent)" }}
                />
                <label htmlFor="payItForward" className="flex flex-col cursor-pointer select-none" onClick={(e) => e.preventDefault()}>
                  <span className="text-sm font-bold text-ink">
                    Pay-It-Forward Meal Donation (₹30)
                  </span>
                  <span className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>
                    Add ₹30 to sponsor a healthy meal for someone in need through the Robin Hood Army.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* ── Bill Summary - Tesler's Law: automated SGST+CGST so user never calculates ── */}
          <div className="doodle-panel p-5">
            <h2 className="text-2xl font-bold text-ink">Bill Summary</h2>
            <div className="mt-4 space-y-2 text-sm font-semibold text-ink/85">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>₹{priceBreakdown.subtotal}</span>
              </div>
              {/* SGST + CGST breakdown - Indian GST compliance / Transparency heuristic */}
              <div className="flex items-center justify-between text-ink/70">
                <span>SGST (2.5%)</span>
                <span>₹{Math.floor(priceBreakdown.tax / 2)}</span>
              </div>
              <div className="flex items-center justify-between text-ink/70">
                <span>CGST (2.5%)</span>
                <span>₹{priceBreakdown.tax - Math.floor(priceBreakdown.tax / 2)}</span>
              </div>
              <div className="flex items-center justify-between text-ink/70">
                <span>Delivery Fee</span>
                {priceBreakdown.deliveryFee === 0 && priceBreakdown.subtotal > 0 ? (
                  <span className="text-green-600 dark:text-green-400 font-bold">Free</span>
                ) : (
                  <span>₹{priceBreakdown.deliveryFee}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-ink/70">
                <span>Platform Fee</span>
                <span>₹{priceBreakdown.platformFee}</span>
              </div>
              <div className="flex items-center justify-between text-ink/70">
                <span>Packing Charges</span>
                <span>₹{priceBreakdown.packingCharges}</span>
              </div>
              {state.checkoutForm.tipAmount > 0 && (
                <div className="flex items-center justify-between text-ink/70">
                  <span>Delivery Tip</span>
                  <span>₹{state.checkoutForm.tipAmount}</span>
                </div>
              )}
              {state.checkoutForm.payItForward && (
                <div className="flex items-center justify-between font-bold" style={{ color: "var(--accent)" }}>
                  <span>Meal Donation</span>
                  <span>₹30</span>
                </div>
              )}
              {priceBreakdown.couponDiscount > 0 && (
                <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                  <span>Coupon Discount</span>
                  <span>-₹{priceBreakdown.couponDiscount}</span>
                </div>
              )}
              <div className="my-2 border-t border-[var(--line)]" />
              <div className="flex items-center justify-between text-2xl font-bold text-ink">
                <span>Total</span>
                <span>₹{priceBreakdown.total}</span>
              </div>
            </div>

            {/* Shneiderman: Closure - clear CTA signals end of ordering transaction */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={cartCount === 0}
              className="doodle-primary-btn mt-5 w-full px-6 py-4 text-lg disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Place order - total ₹${priceBreakdown.total}`}
            >
              Place Order · ₹{priceBreakdown.total}
            </button>
          </div>

          {/* Nielsen Visibility: always-visible tracking bar confirms order progress */}
          <TrackingBar currentStage={state.trackingStage} />
        </section>
      </main>

      {/* Shneiderman: Yield Closure - order success modal confirms transaction completion */}
      <OrderSuccessModal 
        open={state.isOrderModalOpen} 
        onClose={() => {
          setOrderModalOpen(false);
          clearCart();
          navigate("/tracking");
        }} 
      />

      {/* Fitts's Law: Large sticky bottom CTA on mobile for thumb-reach optimization */}
      <div className="mobile-sticky-bar md:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/70">To Pay</p>
          <p className="text-2xl font-bold text-ink">₹{priceBreakdown.total}</p>
        </div>
        <button type="button" className="doodle-primary-btn px-6 py-4 text-base disabled:cursor-not-allowed disabled:opacity-50" onClick={handlePlaceOrder} disabled={cartCount === 0}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutScreen;

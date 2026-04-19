// GlobalUsabilityLayer - cross-cutting HCI concerns applied app-wide.
// Asimov Law 1 (No Harm): onboarding never forces irreversible actions; Skip always available.
// Asimov Law 2 (Obey User): every step follows user's stated preference (language, diet, etc.).
// Asimov Law 3 (Protect Self-Interest): user data stays local; onboarding sets expectations.
// Learnability: 5-step coach-mark tour follows Law of Learning (simple → complex).
// Keyboard shortcuts satisfy Flexibility & Efficiency of Use (Nielsen Heuristic #7).

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuickBite } from "../context/QuickBiteContext";

const ONBOARDING_KEY = "quickbite_onboarding_seen_v1";

// Language strings for Equitable Use principle - EN / HI / TA supported
const LANG_OPTIONS = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
] as const;

// Dietary preference options - personalizes the app on first launch
const DIET_OPTIONS = [
  { id: "veg", label: "Vegetarian", dot: "#16a34a", desc: "Show only veg items by default" },
  { id: "any", label: "No preference", dot: "#94a3b8", desc: "Show all items" },
  { id: "nonveg", label: "Non-Vegetarian", dot: "#dc2626", desc: "Include non-veg items" },
] as const;

const onboardingSteps = [
  {
    id: "welcome",
    chip: "Welcome to QuickBite",
    title: "Fast food delivery on campus",
    description:
      "Order from 50+ restaurants near IIITDM Kancheepuram in under 30 minutes. Your data stays on this device - we never sell it.",
  },
  {
    id: "language",
    chip: "Step 1 of 4 · Language",
    title: "Choose your language",
    description: "QuickBite adapts to your preferred language. You can change this anytime from Settings.",
  },
  {
    id: "diet",
    chip: "Step 2 of 4 · Diet",
    title: "Dietary preference",
    description: "We'll use this to filter your default menu view. Change it any time from Profile settings.",
  },
  {
    id: "search",
    // HCI: Learnability - simple → complex progressive disclosure
    chip: "Step 3 of 4 · Search",
    title: "Finding food is easy",
    description:
      "Use the top search bar to find dishes instantly. Keyboard shortcut: press 'S' from anywhere in the app. Filters let you narrow by veg, price, rating, and prep time.",
  },
  {
    id: "shortcuts",
    // HCI: Flexibility & Efficiency of Use (Nielsen Heuristic #7)
    chip: "Step 4 of 4 · Shortcuts",
    title: "Power-user shortcuts",
    description:
      "Press 'S' → Search · Press 'C' → Cart / Checkout. These work from any screen when you're not typing in a field. Experienced users can skip the menus entirely.",
  },
] as const;

const isTypingContext = (target: EventTarget | null): boolean => {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
};

const GlobalUsabilityLayer = () => {
  const navigate = useNavigate();
  const { isDarkMode, isHighContrast, setHighContrast } = useQuickBite();

  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(ONBOARDING_KEY) !== "1";
  });
  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedDiet, setSelectedDiet] = useState<"veg" | "any" | "nonveg">("any");
  const [showShortcutHint, setShowShortcutHint] = useState(false);

  // Dark-mode class sync
  useEffect(() => {
    document.body.classList.toggle("dark-doodle", isDarkMode);
    return () => { document.body.classList.remove("dark-doodle"); };
  }, [isDarkMode]);

  // High-contrast class sync
  useEffect(() => {
    document.body.classList.toggle("high-contrast", isHighContrast);
    return () => { document.body.classList.remove("high-contrast"); };
  }, [isHighContrast]);

  // Keyboard shortcuts - Flexibility & Efficiency (Nielsen #7)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isTypingContext(e.target)) return;
      const key = e.key.toLowerCase();
      if (key === "s") { e.preventDefault(); navigate("/search"); }
      if (key === "c") { e.preventDefault(); navigate("/checkout"); }
      if (key === "?") { setShowShortcutHint((v) => !v); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate]);

  const completeOnboarding = () => {
    setOnboardingOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ONBOARDING_KEY, "1");
      // Persist dietary preference so SearchFilter can pick it up
      window.localStorage.setItem("quickbite_diet_pref", selectedDiet);
      window.localStorage.setItem("quickbite_lang_pref", selectedLang);
    }
  };

  const currentStep = useMemo(() => onboardingSteps[step], [step]);
  const totalSteps = onboardingSteps.length;
  const isLastStep = step === totalSteps - 1;

  return (
    <>
      {/* ── Onboarding Coach-Mark Overlay ── */}
      {onboardingOpen && (
        <div
          className="onboarding-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
          aria-describedby="onboarding-description"
        >
          <div className="onboarding-card doodle-panel" style={{ maxWidth: "36rem" }}>
            <p className="onboarding-chip">{currentStep.chip}</p>

            <h2 id="onboarding-title" className="mt-3 text-3xl font-bold text-ink leading-tight">
              {currentStep.title}
            </h2>
            <p id="onboarding-description" className="mt-2 text-sm text-ink/85 leading-relaxed">
              {currentStep.description}
            </p>

            {/* ── Language selection step ── */}
            {currentStep.id === "language" && (
              <div className="mt-4 grid gap-2" role="group" aria-label="Select language">
                {LANG_OPTIONS.map((lang) => (
                  <label
                    key={lang.code}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                      selectedLang === lang.code
                        ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                        : "border-[var(--line)] bg-[var(--surface)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="language"
                      value={lang.code}
                      checked={selectedLang === lang.code}
                      onChange={() => setSelectedLang(lang.code)}
                      aria-label={lang.label}
                    />
                    <div>
                      <p className="font-semibold text-ink">{lang.label}</p>
                      <p className="text-xs text-ink/60">{lang.native}</p>
                    </div>
                    {selectedLang === lang.code && (
                      <span className="ml-auto text-xs font-bold text-[var(--accent)]">Selected</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {/* ── Dietary preference step ── */}
            {currentStep.id === "diet" && (
              <div className="mt-4 grid gap-2" role="group" aria-label="Select dietary preference">
                {DIET_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                      selectedDiet === opt.id
                        ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                        : "border-[var(--line)] bg-[var(--surface)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="diet"
                      value={opt.id}
                      checked={selectedDiet === opt.id}
                      onChange={() => setSelectedDiet(opt.id as typeof selectedDiet)}
                    />
                    <span style={{ width: "0.55rem", height: "0.55rem", borderRadius: "50%", background: opt.dot, flexShrink: 0, display: "inline-block" }} aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-ink">{opt.label}</p>
                      <p className="text-xs text-ink/60">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Determinate progress dots - user knows exactly where they are */}
            <div className="onboarding-progress mt-5" aria-label={`Step ${step + 1} of ${totalSteps}`}>
              {onboardingSteps.map((_, idx) => (
                <span
                  key={idx}
                  className={`onboarding-dot ${idx === step ? "active" : ""} ${idx < step ? "passed" : ""}`}
                  aria-hidden="true"
                />
              ))}
            </div>

            {/* Navigation buttons - Shneiderman: User Control & Freedom */}
            <div className="mt-4 flex flex-wrap gap-2">
              {step > 0 && (
                <button type="button" className="doodle-secondary-btn" onClick={() => setStep(step - 1)}>
                  ← Back
                </button>
              )}
              {!isLastStep ? (
                <button
                  type="button"
                  className="doodle-primary-btn px-5 py-3"
                  onClick={() => setStep(step + 1)}
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  className="doodle-primary-btn px-5 py-3"
                  onClick={completeOnboarding}
                >
                  Get Started
                </button>
              )}
              {/* Asimov Law 1: Skip always visible - no harmful forced flow */}
              <button
                type="button"
                className="doodle-secondary-btn ml-auto"
                onClick={completeOnboarding}
              >
                Skip tour
              </button>
            </div>

            {/* HCI: Asimov Law 3 - Protect self-interest / user data transparency */}
            <p className="mt-3 text-[10px] text-ink/45">
              All your data is stored locally on this device. We don't sell or share it.
            </p>
          </div>
        </div>
      )}

      {/* ── Keyboard shortcut hint (toggle with '?') ── */}
      {showShortcutHint && !onboardingOpen && (
        <div
          className="shortcut-hint"
          role="tooltip"
          aria-label="Keyboard shortcuts"
          onClick={() => setShowShortcutHint(false)}
        >
          <p className="font-bold mb-1">Keyboard shortcuts</p>
          <p><kbd>S</kbd> → Search</p>
          <p><kbd>C</kbd> → Cart</p>
          <p><kbd>?</kbd> → Toggle this</p>
        </div>
      )}
    </>
  );
};

export default GlobalUsabilityLayer;

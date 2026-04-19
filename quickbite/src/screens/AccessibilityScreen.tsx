// AccessibilityScreen - Universal Design's 7 Principles made interactive.
// HCI: Each setting maps to a named UD principle, making the HCI rationale visible in code.
// HCI: WCAG 2.1 AA compliance demonstrated through contrast controls.
// HCI: Inclusive design: language toggle, font-size control, voice ordering placeholder.
// HCI: Asimov Law 1 (No Harm) - no forced irreversible actions.
// HCI: Asimov Law 2 (Obey User) - preferences respected.
// HCI: Asimov Law 3 (Protect Self-Interest) - data stays local.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import { useQuickBite } from "../context/QuickBiteContext";

// HCI: Universal Design's 7 principles - mapped to settings below
// 1. Equitable Use → language
// 2. Flexibility in Use → font size
// 3. Simple & Intuitive Use → icon labels
// 4. Perceptible Information → high contrast
// 5. Tolerance for Error → reduce motion
// 6. Low Physical Effort → dark mode
// 7. Size & Space for Approach → large targets + voice

const LANG_MAP: Record<string, string> = { en: "English", hi: "हिन्दी", ta: "தமிழ்" };

const FONT_SIZES = [
  { id: "sm", label: "Small", size: "13px" },
  { id: "md", label: "Medium (Default)", size: "15px" },
  { id: "lg", label: "Large", size: "18px" },
] as const;

const AccessibilityScreen = () => {
  const navigate = useNavigate();
  const { isHighContrast, setHighContrast, isDarkMode, setDarkMode } = useQuickBite();

  const savedLang = (typeof window !== "undefined" && window.localStorage.getItem("quickbite_lang_pref")) || "en";
  const [lang, setLang] = useState<string>(savedLang);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [largeTargets, setLargeTargets] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [voiceActive, setVoiceActive] = useState(false);

  const handleLangChange = (code: string) => {
    setLang(code);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("quickbite_lang_pref", code);
    }
  };

  const handleFontSize = (id: "sm" | "md" | "lg") => {
    setFontSize(id);
    const sizeMap: Record<string, string> = { sm: "13px", md: "15px", lg: "18px" };
    document.documentElement.style.setProperty("font-size", sizeMap[id]);
  };

  const handleReduceMotion = (v: boolean) => {
    setReduceMotion(v);
    document.documentElement.style.setProperty("--anim-speed", v ? "0ms" : "");
  };

  const handleLargeTargets = (v: boolean) => {
    setLargeTargets(v);
    document.body.classList.toggle("large-targets-mode", v);
  };

  const handleVoiceOrder = () => {
    setVoiceActive(true);
    setTimeout(() => setVoiceActive(false), 3000);
  };

  return (
    <div className="page-shell">
      <TopNav showSearch={false} />

      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-3">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
            Settings
          </p>
          <h1 className="mt-1 text-3xl font-bold text-ink">Accessibility & Preferences</h1>
          <p className="mt-1 text-sm text-ink/70">
            Customize your QuickBite experience to match your needs.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">

          {/* ── Language - HCI: UD Principle 1 (Equitable Use) ── */}
          <div className={`a11y-principle-card ${lang !== "en" ? "active" : ""}`}>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                Language
              </p>
              <p className="font-bold text-ink">Choose your preferred language</p>
              <div className="mt-2.5 flex gap-2" role="group" aria-label="Select language">
                {Object.entries(LANG_MAP).map(([code, label]) => (
                  <button
                    key={code}
                    type="button"
                    className={`font-size-btn text-sm ${lang === code ? "selected" : ""}`}
                    onClick={() => handleLangChange(code)}
                    aria-pressed={lang === code}
                    aria-label={`Switch to ${label}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {lang !== "en" && (
                <p className="mt-2 text-xs text-ink/55 italic">
                  {lang === "hi"
                    ? "भाषा बदल दी गई है। पूरी UI अनुवाद अगले अपडेट में।"
                    : "மொழி மாற்றப்பட்டது. முழு மொழிபெயர்ப்பு அடுத்த மேம்படுத்தலில்."}
                </p>
              )}
            </div>
          </div>

          {/* ── Font Size - HCI: UD Principle 2 (Flexibility in Use) ── */}
          <div className={`a11y-principle-card ${fontSize !== "md" ? "active" : ""}`}>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                Text Size
              </p>
              <p className="font-bold text-ink">Adjust text for comfortable reading</p>
              <div className="mt-2.5 flex gap-2" role="group" aria-label="Select font size">
                {FONT_SIZES.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    className={`font-size-btn text-sm ${fontSize === id ? "selected" : ""}`}
                    onClick={() => handleFontSize(id)}
                    aria-pressed={fontSize === id}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Show Labels - HCI: UD Principle 3 (Simple & Intuitive Use) ── */}
          <div className={`a11y-principle-card ${!showLabels ? "active" : ""}`}>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                Icon Labels
              </p>
              <p className="font-bold text-ink">Always show text alongside icons</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">Show icon labels</p>
                  <p className="text-xs text-ink/60">Always-visible text below icons</p>
                </div>
                <label className="toggle-switch" aria-label="Toggle icon labels">
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                  />
                  <span className="toggle-track" />
                </label>
              </div>
            </div>
          </div>

          {/* ── High Contrast - HCI: UD Principle 4 (Perceptible Information) ── */}
          <div className={`a11y-principle-card ${isHighContrast ? "active" : ""}`}>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                Contrast
              </p>
              <p className="font-bold text-ink">Enhance visual clarity</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">High Contrast Mode</p>
                  <p className="text-xs text-ink/60">Sharper text and borders for better readability</p>
                </div>
                <label className="toggle-switch" aria-label="Toggle high contrast mode">
                  <input
                    type="checkbox"
                    checked={isHighContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                  />
                  <span className="toggle-track" />
                </label>
              </div>
            </div>
          </div>

          {/* ── Reduce Motion - HCI: UD Principle 5 (Tolerance for Error) ── */}
          <div className={`a11y-principle-card ${reduceMotion ? "active" : ""}`}>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                Motion
              </p>
              <p className="font-bold text-ink">Control animations and transitions</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">Reduce Motion</p>
                  <p className="text-xs text-ink/60">Disables all animations for a calmer experience</p>
                </div>
                <label className="toggle-switch" aria-label="Toggle reduce motion">
                  <input
                    type="checkbox"
                    checked={reduceMotion}
                    onChange={(e) => handleReduceMotion(e.target.checked)}
                  />
                  <span className="toggle-track" />
                </label>
              </div>
            </div>
          </div>

          {/* ── Dark Mode - HCI: UD Principle 6 (Low Physical Effort) ── */}
          <div className={`a11y-principle-card ${isDarkMode ? "active" : ""}`}>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                Appearance
              </p>
              <p className="font-bold text-ink">Comfortable viewing in any lighting</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">Dark Mode</p>
                  <p className="text-xs text-ink/60">Reduces eye strain in low-light environments</p>
                </div>
                <label className="toggle-switch" aria-label="Toggle dark mode">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                  <span className="toggle-track" />
                </label>
              </div>
            </div>
          </div>

          {/* ── Large Targets + Voice - HCI: UD Principle 7 (Size & Space for Approach) ── */}
          <div className={`a11y-principle-card lg:col-span-2 ${largeTargets || voiceActive ? "active" : ""}`}>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                Interaction
              </p>
              <p className="font-bold text-ink">Easier tapping and hands-free ordering</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">Large Touch Targets</p>
                    <p className="text-xs text-ink/60">Bigger buttons and controls for easier tapping</p>
                  </div>
                  <label className="toggle-switch" aria-label="Enable large touch targets">
                    <input
                      type="checkbox"
                      checked={largeTargets}
                      onChange={(e) => handleLargeTargets(e.target.checked)}
                    />
                    <span className="toggle-track" />
                  </label>
                </div>

                {/* HCI: Asimov Law 2 (obey spoken commands) + UD Principle 7 */}
                <div>
                  <p className="text-sm font-semibold text-ink">Voice Ordering</p>
                  <p className="text-xs text-ink/60 mb-2">Speak to add items to cart hands-free</p>
                  <button
                    type="button"
                    className={`doodle-primary-btn px-5 py-2.5 text-sm ${voiceActive ? "opacity-75" : ""}`}
                    onClick={handleVoiceOrder}
                    aria-live="polite"
                    aria-label={voiceActive ? "Listening…" : "Start voice ordering"}
                  >
                    {voiceActive ? "Listening… 3s" : "Start Voice Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* HCI: Asimov's 3 Laws applied to QuickBite - kept in code as design rationale.
            Law 1 (No Harm): No dark patterns, no fake timers, no hidden fees.
            Law 2 (Obey User): Preferences respected, opt-in only.
            Law 3 (Protect User): All data local, no cloud sync without consent. */}

        {/* ── Privacy & Data ── */}
        <section className="mt-8 pt-6 border-t border-[var(--line)]">
          <h2 className="text-xl font-bold text-ink">Privacy & Data</h2>
          <p className="mt-1 text-sm text-ink/70">
            How QuickBite handles your data and protects your experience.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Your data stays local",
                colour: "#22c55e",
                text: "All preferences, cart, and order history are stored on this device. No cloud sync without your explicit consent.",
              },
              {
                title: "No dark patterns",
                colour: "#f59e0b",
                text: "No fake timers, no hidden fees, no pre-ticked opt-ins. The onboarding Skip button is always visible.",
              },
              {
                title: "Your preferences, your way",
                colour: "#ef4444",
                text: "Language, dietary filter, and dark mode settings are remembered and respected. The app adapts to you.",
              },
            ].map(({ title, colour, text }) => (
              <div key={title} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ background: colour }}
                    aria-hidden="true"
                  />
                  <p className="text-sm font-bold text-ink">{title}</p>
                </div>
                <p className="text-xs text-ink/70 leading-relaxed pl-4">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="doodle-secondary-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <button
            type="button"
            className="doodle-secondary-btn"
            onClick={() => navigate("/profile?tab=settings")}
          >
            Profile Settings →
          </button>
        </div>
      </main>
    </div>
  );
};

export default AccessibilityScreen;

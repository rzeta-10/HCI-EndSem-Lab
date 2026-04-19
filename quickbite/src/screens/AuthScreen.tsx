import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import { useQuickBite } from "../context/QuickBiteContext";

const AuthScreen = () => {
  const navigate = useNavigate();
  const { setLoggedIn, isDarkMode } = useQuickBite();

  const [step, setStep] = useState<"phone" | "captcha" | "otp">("phone");
  const [phone, setPhone] = useState("");
  
  // CAPTCHA State
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  // OTP State
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(30);
  const [attempts, setAttempts] = useState(0);

  // Simulated reCAPTCHA score check
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    
    // Simulate low-score user triggering fallback math CAPTCHA (30% chance)
    if (Math.random() > 0.7) {
      setStep("captcha");
    } else {
      setStep("otp");
      startTimer();
    }
  };

  const handleCaptchaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaAnswer === "5") {
      setStep("otp");
      startTimer();
    } else {
      setCaptchaError("Incorrect. Please try again.");
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 3) {
      setOtpError("Maximum attempts reached. Please start over.");
      return;
    }
    if (otp === "123456") {
      setLoggedIn(true);
      navigate("/");
    } else {
      setAttempts((a) => a + 1);
      setOtpError("Invalid OTP. Try 123456");
    }
  };

  const startTimer = () => {
    setTimer(30);
  };

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  return (
    <div className="page-shell">
      <TopNav showSearch={false} />
      
      <main className="mx-auto flex w-full max-w-md flex-col items-center justify-center px-4 pb-24 pt-12">
        <div className="doodle-panel w-full p-6 sm:p-8">
          <h1 className="text-2xl font-black text-ink mb-1">
            {step === "phone" ? "Login or Signup" : step === "captcha" ? "Security Check" : "Verify Phone"}
          </h1>
          <p className="text-sm text-ink/70 mb-6">
            {step === "phone" 
              ? "Enter your mobile number to proceed."
              : step === "captcha"
              ? "Please solve this quick math puzzle."
              : `Enter the 6-digit OTP sent to +91 ${phone}`
            }
          </p>

          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm font-bold text-ink">Mobile Number</label>
                <div className="flex gap-2">
                  <span className="flex items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-3 text-sm font-semibold text-ink/70">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="98765 43210"
                    className="doodle-input flex-1"
                    autoFocus
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={phone.length < 10}
                className="doodle-primary-btn w-full py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
              <div className="mt-4 text-center text-xs text-ink/50">
                Protected by reCAPTCHA v3.
              </div>
            </form>
          )}

          {step === "captcha" && (
            <form onSubmit={handleCaptchaSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="captcha" className="text-sm font-bold text-ink">What is 2 + 3?</label>
                <input
                  id="captcha"
                  type="number"
                  value={captchaAnswer}
                  onChange={(e) => {
                    setCaptchaAnswer(e.target.value);
                    setCaptchaError("");
                  }}
                  placeholder="Answer"
                  className="doodle-input"
                  autoFocus
                />
                {captchaError && <p className="text-xs font-bold text-red-600">{captchaError}</p>}
              </div>
              <button 
                type="submit" 
                disabled={!captchaAnswer}
                className="doodle-primary-btn w-full py-3 mt-2"
              >
                Verify
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="otp" className="text-sm font-bold text-ink">OTP (Try 123456)</label>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/[^0-9]/g, ""));
                    setOtpError("");
                  }}
                  placeholder="• • • • • •"
                  className="doodle-input text-center text-2xl tracking-[0.5em]"
                  autoFocus
                />
                {otpError && <p className="text-xs font-bold text-red-600">{otpError}</p>}
              </div>
              <button 
                type="submit" 
                disabled={otp.length < 6 || attempts >= 3}
                className="doodle-primary-btn w-full py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify OTP
              </button>
              <div className="mt-2 text-center">
                {timer > 0 ? (
                  <p className="text-xs text-ink/70">Resend OTP in 00:{timer.toString().padStart(2, "0")}</p>
                ) : (
                  <button
                    type="button"
                    onClick={startTimer}
                    className="text-xs font-bold text-[var(--accent-strong)] hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  );
};

export default AuthScreen;

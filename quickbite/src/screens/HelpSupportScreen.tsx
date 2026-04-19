import { FormEvent, useEffect, useState } from "react";
import EmptyStateCard from "../components/EmptyStateCard";
import FAQAccordion from "../components/FAQAccordion";
import TopNav from "../components/TopNav";
import { WifiOffIcon } from "../components/Icons";
import { SupportTicketDraft } from "../types";

const faqItems = [
  {
    question: "How do I track my active order?",
    answer: "Open the Tracking page from the hamburger menu. ETA and current status are updated continuously.",
  },
  {
    question: "How can I quickly repeat a previous order?",
    answer: "Go to Profile & Order History and tap Reorder on any previous order card.",
  },
  {
    question: "Can I edit my default address?",
    answer: "Yes. Open Profile and update Default Address in the editable profile form.",
  },
];

const HelpSupportScreen = () => {
  const [isOffline, setIsOffline] = useState<boolean>(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );
  const [ticket, setTicket] = useState<SupportTicketDraft>({ topic: "", message: "" });
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const submitTicket = (event: FormEvent) => {
    event.preventDefault();

    // Robustness & Error Handling: when offline, the UI gives explicit recovery guidance (retry) instead of silently failing support submission.
    if (isOffline) {
      setStatusMessage("You are offline. Reconnect and tap Retry before submitting.");
      return;
    }

    if (ticket.topic.trim().length < 3 || ticket.message.trim().length < 10) {
      setStatusMessage("Please enter a clear topic and at least 10 characters in your message.");
      return;
    }

    setStatusMessage("Support ticket drafted successfully. Our team will contact you shortly.");
    setTicket({ topic: "", message: "" });
  };

  return (
    <div className="page-shell">
      <TopNav showSearch={false} />

      <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 pb-24 pt-3 lg:grid-cols-[1.15fr_1fr]">
        <section className="space-y-5">
          <article className="doodle-panel p-5">
            <h1 className="text-3xl font-bold text-ink">Help & Support</h1>
            <p className="mt-2 text-sm text-ink/75">Quick assistance for orders, payments, and account related concerns.</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="quick-help-card">
                <p className="font-semibold">Call Support</p>
                <p className="text-sm text-ink/75">+91 90000 11111</p>
              </div>
              <div className="quick-help-card">
                <p className="font-semibold">Email</p>
                <p className="text-sm text-ink/75">help@quickbite.support</p>
              </div>
            </div>
          </article>

          <article className="doodle-panel p-5">
            <h2 className="text-2xl font-bold text-ink">Frequently Asked Questions</h2>
            <div className="mt-4">
              <FAQAccordion items={faqItems} />
            </div>
          </article>
        </section>

        <section className="space-y-5">
          {isOffline ? (
            <EmptyStateCard
              icon={<WifiOffIcon size={28} />}
              title="Support is Offline"
              description="Your network appears disconnected. Check connection and retry to send your message."
              actionLabel="Retry"
              onAction={() => setIsOffline(!navigator.onLine)}
            />
          ) : null}

          <article className="doodle-panel p-5">
            <h2 className="text-2xl font-bold text-ink">Raise a Ticket</h2>
            <form className="mt-4 space-y-3" onSubmit={submitTicket}>
              <label className="text-sm font-semibold text-ink">
                Topic
                <input
                  className="doodle-input mt-1"
                  placeholder="Order issue / Payment / Delivery"
                  value={ticket.topic}
                  onChange={(event) => setTicket((prev) => ({ ...prev, topic: event.target.value }))}
                />
              </label>

              <label className="text-sm font-semibold text-ink">
                Message
                <textarea
                  className="doodle-input mt-1"
                  rows={5}
                  placeholder="Describe the issue in detail"
                  value={ticket.message}
                  onChange={(event) => setTicket((prev) => ({ ...prev, message: event.target.value }))}
                />
              </label>

              <button type="submit" className="doodle-primary-btn px-6 py-3">
                Submit Ticket
              </button>
            </form>

            {statusMessage ? <p className="mt-3 text-sm font-semibold text-ink/80">{statusMessage}</p> : null}
          </article>
        </section>
      </main>
    </div>
  );
};

export default HelpSupportScreen;

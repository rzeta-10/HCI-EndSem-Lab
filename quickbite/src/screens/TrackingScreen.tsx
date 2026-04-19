import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmptyStateCard from "../components/EmptyStateCard";
import TopNav from "../components/TopNav";
import TrackingBar from "../components/TrackingBar";
import { useQuickBite } from "../context/QuickBiteContext";
import { TruckIcon } from "../components/Icons";
import { TrackingStage } from "../types";

const deriveStage = (placedAtISO: string): TrackingStage => {
  const seconds = (Date.now() - new Date(placedAtISO).getTime()) / 1000;
  if (seconds < 2.5) {
    return "Order Received";
  }
  if (seconds < 5) {
    return "Food Cooking";
  }
  return "Out for Delivery";
};

const TrackingScreen = () => {
  const { getActiveOrder } = useQuickBite();
  const navigate = useNavigate();
  const activeOrder = getActiveOrder();

  const [stage, setStage] = useState<TrackingStage | null>(
    activeOrder ? deriveStage(activeOrder.placedAtISO) : null
  );

  useEffect(() => {
    if (!activeOrder) {
      setStage(null);
      return;
    }

    const timer = window.setInterval(() => {
      setStage(deriveStage(activeOrder.placedAtISO));
    }, 500);

    return () => window.clearInterval(timer);
  }, [activeOrder]);

  const etaRemaining = useMemo(() => {
    if (!activeOrder) {
      return 0;
    }

    const passedMinutes = (Date.now() - new Date(activeOrder.placedAtISO).getTime()) / 60000;
    return Math.max(0, Math.ceil(activeOrder.etaMinutes - passedMinutes));
  }, [activeOrder, stage]);

  if (!activeOrder) {
    return (
      <div className="page-shell">
        <TopNav showSearch={false} />
        <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-3">
          <EmptyStateCard
            icon={<TruckIcon size={28} />}
            title="No Active Order"
            description="Place an order to see live tracking updates with ETA, status, and rider details."
            actionLabel="Go to Menu"
            onAction={() => navigate("/menu")}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <TopNav showSearch={false} />

      <main className="mx-auto w-full max-w-5xl space-y-5 px-4 pb-24 pt-3">
        {/* Inverted Pyramid: the topmost section shows ETA and current status first, with all secondary details below. */}
        <section className="doodle-panel tracking-hero p-6 sm:p-8">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-ink/70">Estimated Time Arrival</p>
              <h1 className="text-6xl font-black leading-none text-ink sm:text-7xl">{etaRemaining}–{etaRemaining + 5} min</h1>
              <p className="mt-3 text-2xl font-bold text-ink">{stage}</p>
              <Link to="/checkout" className="doodle-secondary-btn mt-4 inline-flex">
                Open Checkout
              </Link>
            </div>
            <img
              src="/assets/delivery-image.jpeg"
              alt="Delivery on the way"
              className="hidden h-36 w-36 rounded-2xl object-cover shadow-lg sm:block lg:h-44 lg:w-44"
            />
          </div>
        </section>

        <TrackingBar currentStage={stage} />

        <section className="doodle-panel p-5">
          <h2 className="text-2xl font-bold text-ink">Order Details</h2>
          <div className="mt-3 grid gap-2 text-sm text-ink/85 sm:grid-cols-2">
            <div className="flex flex-col gap-1 items-start">
              <p>
                <span className="font-semibold">Restaurant:</span> {activeOrder.restaurantName}
              </p>
              <a href="tel:+919876543210" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Call Restaurant
              </a>
            </div>
            <div className="flex flex-col gap-1 items-start">
              <p>
                <span className="font-semibold">Driver:</span> {activeOrder.driverName}
              </p>
              <a href="tel:+918765432109" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Call Driver
              </a>
            </div>
            <p className="sm:col-span-2">
              <span className="font-semibold">Address:</span> {activeOrder.restaurantAddress}
            </p>
            <p>
              <span className="font-semibold">Order ID:</span> {activeOrder.id}
            </p>
            <p>
              <span className="font-semibold">Placed:</span> {new Date(activeOrder.placedAtISO).toLocaleString()}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TrackingScreen;

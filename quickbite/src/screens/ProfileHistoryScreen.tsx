import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConfirmSketchModal from "../components/ConfirmSketchModal";
import EmptyStateCard from "../components/EmptyStateCard";
import FavoriteOrderCard from "../components/FavoriteOrderCard";
import HistoryOrderCard from "../components/HistoryOrderCard";
import TopNav from "../components/TopNav";
import { useQuickBite } from "../context/QuickBiteContext";
import { InboxIcon } from "../components/Icons";
import { DestructiveTarget, FavoriteOrder } from "../types";

const ProfileHistoryScreen = () => {
  const {
    state,
    updateProfileField,
    reorderFromHistory,
    clearCart,
    addToCart,
    removeFavorite,
    deleteAccountDataConfirmed,
  } = useQuickBite();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [pendingDestructiveAction, setPendingDestructiveAction] =
    useState<DestructiveTarget | null>(null);
  const [password, setPassword] = useState("quickbite-demo-pass");
  const [showPassword, setShowPassword] = useState(false);

  const settingsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (searchParams.get("tab") === "settings") {
      settingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchParams]);

  const destructiveCopy = useMemo(() => {
    if (!pendingDestructiveAction) {
      return null;
    }

    if (pendingDestructiveAction.type === "delete_account") {
      return {
        title: "Delete Account Data",
        description:
          "This clears local profile, favorites, and order history. To prevent accidental loss, confirmation text is required.",
        confirmLabel: "Delete Account Data",
        confirmKeyword: "QUICKBITE",
      };
    }

    return {
      title: "Delete Favorite Order",
      description: `Remove '${pendingDestructiveAction.favoriteName}' from favorites? This action is guarded to prevent accidental data loss.`,
      confirmLabel: "Delete Favorite",
      confirmKeyword: undefined,
    };
  }, [pendingDestructiveAction]);

  const handleHistoryReorder = (orderId: string) => {
    const ok = reorderFromHistory(orderId);
    if (ok) {
      navigate("/checkout");
    }
  };

  const handleFavoriteReorder = (favorite: FavoriteOrder) => {
    clearCart();
    favorite.lines.forEach((line) => {
      for (let count = 0; count < line.quantity; count += 1) {
        addToCart(line.item);
      }
    });
    navigate("/checkout");
  };

  const handleConfirmDestructive = () => {
    if (!pendingDestructiveAction) {
      return;
    }

    if (pendingDestructiveAction.type === "delete_favorite") {
      removeFavorite(pendingDestructiveAction.favoriteId);
    }

    if (pendingDestructiveAction.type === "delete_account") {
      deleteAccountDataConfirmed();
    }

    setPendingDestructiveAction(null);
  };

  return (
    <div className="page-shell">
      <TopNav showSearch={false} />

      <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 pb-24 pt-3 lg:grid-cols-[1.1fr_1.4fr]">
        <section className="space-y-5">
          <article className="doodle-panel p-5">
            <h1 className="text-3xl font-bold text-ink">Profile</h1>
            <div className="mt-4 grid gap-3">
              <label className="text-sm font-semibold text-ink">
                Name
                <input
                  className="doodle-input mt-1"
                  value={state.profile.name}
                  onChange={(event) => updateProfileField("name", event.target.value)}
                />
              </label>
              <label className="text-sm font-semibold text-ink">
                Email
                <input
                  className="doodle-input mt-1"
                  value={state.profile.email}
                  onChange={(event) => updateProfileField("email", event.target.value)}
                />
              </label>
              <label className="text-sm font-semibold text-ink">
                Phone
                <input
                  className="doodle-input mt-1"
                  value={state.profile.phone}
                  onChange={(event) => updateProfileField("phone", event.target.value)}
                />
              </label>
              <label className="text-sm font-semibold text-ink">
                Default Address
                <textarea
                  className="doodle-input mt-1"
                  rows={3}
                  value={state.profile.defaultAddress}
                  onChange={(event) => updateProfileField("defaultAddress", event.target.value)}
                />
              </label>

              {/* Password masking usability case (NN/g): default masking is kept for privacy, but a Show Password option reduces typing errors and failed submissions. */}
              <label className="text-sm font-semibold text-ink">
                Password
                <input
                  className="doodle-input mt-1"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  aria-describedby="password-help"
                />
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(event) => setShowPassword(event.target.checked)}
                  aria-label="Show password text"
                />
                Show Password
              </label>
              <p id="password-help" className="text-xs text-ink/70">
                Enabling visibility helps catch typos quickly before saving.
              </p>
            </div>
          </article>

          <button
              type="button"
              className="doodle-trash-btn mt-4 w-full justify-center py-3 text-sm"
              onClick={() => setPendingDestructiveAction({ type: "delete_account" })}
            >
              Delete Account Data
            </button>
        </section>

        <section className="space-y-5">
          <article className="doodle-panel p-5">
            <h2 className="text-3xl font-bold text-ink">Order History</h2>
            <p className="text-sm text-ink/75">Recent orders with one-tap reorder shortcut.</p>

            {/* Flexibility & Efficiency of Use: one-click Reorder bypasses full browse flow for experienced/frequent users. */}
            <div className="mt-4 space-y-3">
              {state.orderHistory.length === 0 ? (
                <EmptyStateCard
                  icon={<InboxIcon size={28} />}
                  title="No Orders Yet"
                  description="Place your first order and it will appear here with a quick reorder option."
                  actionLabel="Browse Menu"
                  onAction={() => navigate("/menu")}
                />
              ) : (
                state.orderHistory.map((order) => (
                  <HistoryOrderCard key={order.id} order={order} onReorder={handleHistoryReorder} />
                ))
              )}
            </div>
          </article>

          <article className="doodle-panel p-5">
            <h2 className="text-3xl font-bold text-ink">Favorite Orders</h2>
            <div className="mt-4 space-y-3">
              {state.favorites.length === 0 ? (
                <p className="text-sm font-semibold text-ink/70">No saved favorites available.</p>
              ) : (
                state.favorites.map((favorite) => (
                  <FavoriteOrderCard
                    key={favorite.id}
                    favorite={favorite}
                    onReorder={handleFavoriteReorder}
                    onDelete={(targetFavorite) =>
                      setPendingDestructiveAction({
                        type: "delete_favorite",
                        favoriteId: targetFavorite.id,
                        favoriteName: targetFavorite.name,
                      })
                    }
                  />
                ))
              )}
            </div>
          </article>
        </section>
      </main>

      {destructiveCopy ? (
        <ConfirmSketchModal
          open={Boolean(pendingDestructiveAction)}
          title={destructiveCopy.title}
          description={destructiveCopy.description}
          confirmLabel={destructiveCopy.confirmLabel}
          confirmKeyword={destructiveCopy.confirmKeyword}
          onCancel={() => setPendingDestructiveAction(null)}
          onConfirm={handleConfirmDestructive}
        />
      ) : null}
    </div>
  );
};

export default ProfileHistoryScreen;

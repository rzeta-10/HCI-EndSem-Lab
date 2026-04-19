import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyStateCard from "../components/EmptyStateCard";
import FilterBar from "../components/FilterBar";
import FoodCard from "../components/FoodCard";
import TopNav from "../components/TopNav";
import { useQuickBite } from "../context/QuickBiteContext";
import { InboxIcon, WifiOffIcon } from "../components/Icons";

const SearchFilterScreen = () => {
  const { filteredItems, state, setSearchFilters, resetSearchFilters, setSearchTerm } = useQuickBite();
  const [isOffline, setIsOffline] = useState<boolean>(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

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

  const subtitle = useMemo(() => {
    if (isOffline) {
      return "Offline mode";
    }
    return `${filteredItems.length} result${filteredItems.length === 1 ? "" : "s"}`;
  }, [isOffline, filteredItems.length]);

  return (
    <div className="page-shell">
      <TopNav showSearch />

      <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 pb-24 pt-3 lg:grid-cols-[0.95fr_2.05fr]">
        {/* Serial Position Effect: highest-use filters are placed at the start (Veg Only) and end (Rating 4.0+) for better recall and faster repeat use. */}
        <FilterBar
          filters={state.searchFilters}
          onUpdate={setSearchFilters}
          onReset={() => {
            resetSearchFilters();
            setSearchTerm("");
          }}
        />

        <section className="space-y-4">
          <div className="doodle-panel flex flex-wrap items-center justify-between gap-3 bg-[var(--surface)] p-4">
            <div>
              <h1 className="text-3xl font-bold text-ink">Search & Filter</h1>
              <p className="text-sm font-semibold text-ink/75">{subtitle}</p>
            </div>
            <Link to="/menu" className="doodle-secondary-btn">
              Back to Menu
            </Link>
          </div>

          {/* Robustness & Error Handling: offline/no-result states provide clear recovery actions instead of dead ends. */}
          {isOffline ? (
            <EmptyStateCard
              icon={<WifiOffIcon size={28} />}
              title="Network Offline"
              description="Looks like your internet is sketchy right now. Reconnect and retry to continue searching dishes."
              actionLabel="Retry"
              onAction={() => setIsOffline(!navigator.onLine)}
            />
          ) : filteredItems.length === 0 ? (
            <EmptyStateCard
              icon={<InboxIcon size={28} />}
              title="No Results Found"
              description="Your current query and filters did not match any items. Try resetting filters or searching another keyword."
              actionLabel="Reset Filters"
              onAction={() => {
                resetSearchFilters();
                setSearchTerm("");
              }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SearchFilterScreen;

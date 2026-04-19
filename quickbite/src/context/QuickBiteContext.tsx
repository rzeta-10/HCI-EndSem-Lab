import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { menuItems } from "../data/menuData";
import {
  CartLine,
  CheckoutForm,
  FavoriteOrder,
  FoodCategory,
  FoodItem,
  OrderHistoryItem,
  PriceBreakdown,
  ProfileData,
  SearchFilters,
  TrackingStage,
} from "../types";

type SelectedCategory = FoodCategory | "All";

const STORAGE_KEY = "quickbite_app_state_v2";

const defaultSearchFilters: SearchFilters = {
  vegOnly: false,
  ratingAtLeastFour: false,
  priceBand: "Any",
  maxPrepMinutes: null,
};

const defaultProfile: ProfileData = {
  name: "Rohan",
  email: "rohan.quickbite@example.com",
  phone: "+91 1234567890",
  defaultAddress: "Laboratory Complex, IIITDM Kancheepuram, Chennai - 600127",
};

const makeSeedFavorites = (): FavoriteOrder[] => {
  const find = (id: string) => menuItems.find((item) => item.id === id);

  const healthy = find("healthy-01");
  const drink = find("drinks-01");
  const burger = find("burger-02");
  const dessert = find("dessert-02");

  const favorites: FavoriteOrder[] = [];

  if (healthy && drink) {
    favorites.push({
      id: "fav-healthy-cooler",
      name: "Healthy Bowl + Mango Cooler",
      lines: [
        { item: healthy, quantity: 1 },
        { item: drink, quantity: 1 },
      ],
    });
  }

  if (burger && dessert) {
    favorites.push({
      id: "fav-burger-dessert",
      name: "Paneer Burger + Sundae",
      lines: [
        { item: burger, quantity: 1 },
        { item: dessert, quantity: 1 },
      ],
    });
  }

  return favorites;
};

interface QuickBiteState {
  searchTerm: string;
  selectedCategory: SelectedCategory;
  searchFilters: SearchFilters;
  cart: CartLine[];
  checkoutForm: CheckoutForm;
  isHamburgerOpen: boolean;
  isOrderModalOpen: boolean;
  trackingStage: TrackingStage | null;
  orderHistory: OrderHistoryItem[];
  favorites: FavoriteOrder[];
  profile: ProfileData;
  activeOrderId: string | null;
  isHighContrast: boolean;
  isDarkMode: boolean;
  isLoggedIn: boolean;
}

interface PersistedQuickBiteState {
  orderHistory: OrderHistoryItem[];
  favorites: FavoriteOrder[];
  profile: ProfileData;
  activeOrderId: string | null;
  isHighContrast: boolean;
  isDarkMode: boolean;
  isLoggedIn: boolean;
}

type Action =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_SELECTED_CATEGORY"; payload: SelectedCategory }
  | { type: "SET_SEARCH_FILTERS"; payload: Partial<SearchFilters> }
  | { type: "RESET_SEARCH_FILTERS" }
  | { type: "ADD_TO_CART"; payload: FoodItem }
  | { type: "SET_CART"; payload: CartLine[] }
  | { type: "INCREMENT_ITEM"; payload: string }
  | { type: "DECREMENT_ITEM"; payload: string }
  | { type: "REMOVE_LINE"; payload: string }
  | { type: "RESTORE_LINE"; payload: CartLine }
  | {
      type: "SET_CHECKOUT_FIELD";
      payload: { key: keyof CheckoutForm; value: any };
    }
  | { type: "SET_HAMBURGER_OPEN"; payload: boolean }
  | { type: "SET_ORDER_MODAL_OPEN"; payload: boolean }
  | { type: "SET_TRACKING_STAGE"; payload: TrackingStage | null }
  | { type: "CLEAR_CART" }
  | { type: "ADD_ORDER_HISTORY"; payload: OrderHistoryItem }
  | { type: "SET_ACTIVE_ORDER_ID"; payload: string | null }
  | { type: "REMOVE_FAVORITE"; payload: string }
  | { type: "SET_PROFILE_FIELD"; payload: { key: keyof ProfileData; value: string } }
  | { type: "SET_HIGH_CONTRAST"; payload: boolean }
  | { type: "SET_DARK_MODE"; payload: boolean }
  | { type: "SET_LOGGED_IN"; payload: boolean }
  | { type: "DELETE_ACCOUNT_DATA" };

const getDefaultState = (): QuickBiteState => ({
  searchTerm: "",
  selectedCategory: "All",
  searchFilters: defaultSearchFilters,
  cart: [],
  checkoutForm: {
    address: defaultProfile.defaultAddress,
    paymentMethod: "UPI",
    tipAmount: 0,
    payItForward: false,
  },
  isHamburgerOpen: false,
  isOrderModalOpen: false,
  trackingStage: null,
  orderHistory: [],
  favorites: makeSeedFavorites(),
  profile: defaultProfile,
  activeOrderId: null,
  isHighContrast: false,
  isDarkMode: false,
  isLoggedIn: false,
});

const getInitialState = (): QuickBiteState => {
  const base = getDefaultState();

  if (typeof window === "undefined") {
    return base;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return base;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedQuickBiteState>;

    return {
      ...base,
      orderHistory: Array.isArray(parsed.orderHistory) ? parsed.orderHistory : base.orderHistory,
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : base.favorites,
      profile: parsed.profile ? { ...base.profile, ...parsed.profile } : base.profile,
      activeOrderId:
        typeof parsed.activeOrderId === "string" || parsed.activeOrderId === null
          ? parsed.activeOrderId
          : null,
      isHighContrast:
        typeof parsed.isHighContrast === "boolean" ? parsed.isHighContrast : base.isHighContrast,
      isDarkMode: typeof parsed.isDarkMode === "boolean" ? parsed.isDarkMode : base.isDarkMode,
      isLoggedIn: typeof parsed.isLoggedIn === "boolean" ? parsed.isLoggedIn : base.isLoggedIn,
      checkoutForm: {
        ...base.checkoutForm,
        address:
          parsed.profile && typeof parsed.profile.defaultAddress === "string"
            ? parsed.profile.defaultAddress
            : base.checkoutForm.address,
      },
    };
  } catch {
    return base;
  }
};

const cloneLines = (lines: CartLine[]): CartLine[] =>
  lines.map((line) => ({
    item: line.item,
    quantity: line.quantity,
  }));

const quickBiteReducer = (state: QuickBiteState, action: Action): QuickBiteState => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_SEARCH_FILTERS":
      return {
        ...state,
        searchFilters: {
          ...state.searchFilters,
          ...action.payload,
        },
      };
    case "RESET_SEARCH_FILTERS":
      return { ...state, searchFilters: defaultSearchFilters };
    case "ADD_TO_CART": {
      const existing = state.cart.find((line) => line.item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((line) =>
            line.item.id === action.payload.id
              ? { ...line, quantity: line.quantity + 1 }
              : line
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { item: action.payload, quantity: 1 }],
      };
    }
    case "SET_CART":
      return {
        ...state,
        cart: cloneLines(action.payload),
      };
    case "INCREMENT_ITEM":
      return {
        ...state,
        cart: state.cart.map((line) =>
          line.item.id === action.payload
            ? { ...line, quantity: line.quantity + 1 }
            : line
        ),
      };
    case "DECREMENT_ITEM":
      return {
        ...state,
        cart: state.cart
          .map((line) =>
            line.item.id === action.payload
              ? { ...line, quantity: line.quantity - 1 }
              : line
          )
          .filter((line) => line.quantity > 0),
      };
    case "REMOVE_LINE":
      return {
        ...state,
        cart: state.cart.filter((line) => line.item.id !== action.payload),
      };
    case "RESTORE_LINE": {
      const existing = state.cart.find((line) => line.item.id === action.payload.item.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((line) =>
            line.item.id === action.payload.item.id
              ? { ...line, quantity: line.quantity + action.payload.quantity }
              : line
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    }
    case "SET_CHECKOUT_FIELD":
      return {
        ...state,
        checkoutForm: {
          ...state.checkoutForm,
          [action.payload.key]: action.payload.value,
        },
      };
    case "SET_HAMBURGER_OPEN":
      return { ...state, isHamburgerOpen: action.payload };
    case "SET_ORDER_MODAL_OPEN":
      return { ...state, isOrderModalOpen: action.payload };
    case "SET_TRACKING_STAGE":
      return { ...state, trackingStage: action.payload };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "ADD_ORDER_HISTORY":
      return {
        ...state,
        orderHistory: [action.payload, ...state.orderHistory],
      };
    case "SET_ACTIVE_ORDER_ID":
      return { ...state, activeOrderId: action.payload };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((favorite) => favorite.id !== action.payload),
      };
    case "SET_PROFILE_FIELD":
      return {
        ...state,
        profile: {
          ...state.profile,
          [action.payload.key]: action.payload.value,
        },
        checkoutForm:
          action.payload.key === "defaultAddress"
            ? {
                ...state.checkoutForm,
                address: action.payload.value,
              }
            : state.checkoutForm,
      };
    case "SET_HIGH_CONTRAST":
      return {
        ...state,
        isHighContrast: action.payload,
      };
    case "SET_DARK_MODE":
      return {
        ...state,
        isDarkMode: action.payload,
      };
    case "SET_LOGGED_IN":
      return {
        ...state,
        isLoggedIn: action.payload,
      };

    case "DELETE_ACCOUNT_DATA":
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("quickbite_onboarding_seen_v1");
      }
      return {
        ...state,
        cart: [],
        searchTerm: "",
        searchFilters: defaultSearchFilters,
        orderHistory: [],
        favorites: makeSeedFavorites(),
        profile: defaultProfile,
        activeOrderId: null,
        checkoutForm: {
          ...state.checkoutForm,
          address: defaultProfile.defaultAddress,
        },
      };
    default:
      return state;
  }
};

interface QuickBiteContextValue {
  state: QuickBiteState;
  filteredItems: FoodItem[];
  cartCount: number;
  priceBreakdown: PriceBreakdown;
  setSearchTerm: (value: string) => void;
  setSelectedCategory: (value: SelectedCategory) => void;
  setSearchFilters: (updates: Partial<SearchFilters>) => void;
  resetSearchFilters: () => void;
  addToCart: (item: FoodItem) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  removeLine: (itemId: string) => void;
  restoreLine: (line: CartLine) => void;
  setCheckoutField: <K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) => void;
  toggleHamburger: () => void;
  closeHamburger: () => void;
  setOrderModalOpen: (open: boolean) => void;
  setTrackingStage: (stage: TrackingStage | null) => void;
  clearCart: () => void;
  placeOrderAndRecordHistory: () => OrderHistoryItem | null;
  reorderFromHistory: (orderId: string) => boolean;
  removeFavorite: (favoriteId: string) => void;
  updateProfileField: (key: keyof ProfileData, value: string) => void;
  deleteAccountDataConfirmed: () => void;
  getActiveOrder: () => OrderHistoryItem | null;
  isHighContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;
  isDarkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  toggleDarkMode: () => void;
  isLoggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
}

const QuickBiteContext = createContext<QuickBiteContextValue | null>(null);

const driverNames = [
  "Ravi K.",
  "Divya S.",
  "Arjun M.",
  "Priya T.",
  "Mohammed A.",
  "Karthik R.",
];

export const QuickBiteProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(quickBiteReducer, undefined, getInitialState);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const payload: PersistedQuickBiteState = {
      orderHistory: state.orderHistory,
      favorites: state.favorites,
      profile: state.profile,
      activeOrderId: state.activeOrderId,
      isHighContrast: state.isHighContrast,
      isDarkMode: state.isDarkMode,
      isLoggedIn: state.isLoggedIn,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    state.orderHistory,
    state.favorites,
    state.profile,
    state.activeOrderId,
    state.isHighContrast,
    state.isDarkMode,
    state.isLoggedIn,
  ]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = state.searchTerm.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        state.selectedCategory === "All" || item.category === state.selectedCategory;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch);

      const matchesVeg = !state.searchFilters.vegOnly || item.isVeg;
      const matchesRating = !state.searchFilters.ratingAtLeastFour || item.rating >= 4;

      const matchesPriceBand =
        state.searchFilters.priceBand === "Any" ||
        (state.searchFilters.priceBand === "Under200" && item.price < 200) ||
        (state.searchFilters.priceBand === "200to300" && item.price >= 200 && item.price <= 300) ||
        (state.searchFilters.priceBand === "Above300" && item.price > 300);

      const matchesPrepMinutes =
        state.searchFilters.maxPrepMinutes === null ||
        item.prepMinutes <= state.searchFilters.maxPrepMinutes;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesVeg &&
        matchesRating &&
        matchesPriceBand &&
        matchesPrepMinutes
      );
    });
  }, [state.searchTerm, state.selectedCategory, state.searchFilters]);

  const cartCount = useMemo(
    () => state.cart.reduce((sum, line) => sum + line.quantity, 0),
    [state.cart]
  );

  const priceBreakdown = useMemo<PriceBreakdown>(() => {
    const subtotal = state.cart.reduce(
      (sum, line) => sum + line.item.price * line.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.05);
    const deliveryFee = subtotal > 0 ? (subtotal > 199 ? 0 : 39) : 0; // Free delivery above 199
    const platformFee = subtotal > 0 ? 5 : 0;
    const packingCharges = subtotal > 0 ? 15 : 0;
    const tipAmount = state.checkoutForm.tipAmount;
    const couponDiscount = subtotal > 0 && state.orderHistory.length === 0 ? 20 : 0; // Surprise ₹20 off first order
    const mealDonation = state.checkoutForm.payItForward ? 30 : 0; // ₹30 flat meal donation

    return {
      subtotal,
      tax,
      deliveryFee,
      platformFee,
      packingCharges,
      tipAmount,
      couponDiscount,
      total: subtotal > 0 ? subtotal + tax + deliveryFee + platformFee + packingCharges + tipAmount + mealDonation - couponDiscount : 0,
    };
  }, [state.cart]);

  const setSearchTerm = useCallback(
    (value: string) => dispatch({ type: "SET_SEARCH_TERM", payload: value }),
    []
  );

  const setSelectedCategory = useCallback(
    (value: SelectedCategory) => dispatch({ type: "SET_SELECTED_CATEGORY", payload: value }),
    []
  );

  const setSearchFilters = useCallback(
    (updates: Partial<SearchFilters>) => dispatch({ type: "SET_SEARCH_FILTERS", payload: updates }),
    []
  );

  const resetSearchFilters = useCallback(
    () => dispatch({ type: "RESET_SEARCH_FILTERS" }),
    []
  );

  const addToCart = useCallback(
    (item: FoodItem) => dispatch({ type: "ADD_TO_CART", payload: item }),
    []
  );

  const incrementItem = useCallback(
    (itemId: string) => dispatch({ type: "INCREMENT_ITEM", payload: itemId }),
    []
  );

  const decrementItem = useCallback(
    (itemId: string) => dispatch({ type: "DECREMENT_ITEM", payload: itemId }),
    []
  );

  const removeLine = useCallback(
    (itemId: string) => dispatch({ type: "REMOVE_LINE", payload: itemId }),
    []
  );

  const restoreLine = useCallback(
    (line: CartLine) => dispatch({ type: "RESTORE_LINE", payload: line }),
    []
  );

  const setCheckoutField = useCallback(
    <K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) =>
      dispatch({
        type: "SET_CHECKOUT_FIELD",
        payload: { key, value },
      }),
    []
  );

  const toggleHamburger = useCallback(
    () => dispatch({ type: "SET_HAMBURGER_OPEN", payload: !state.isHamburgerOpen }),
    [state.isHamburgerOpen]
  );

  const closeHamburger = useCallback(
    () => dispatch({ type: "SET_HAMBURGER_OPEN", payload: false }),
    []
  );

  const setOrderModalOpen = useCallback(
    (open: boolean) => dispatch({ type: "SET_ORDER_MODAL_OPEN", payload: open }),
    []
  );

  const setTrackingStage = useCallback(
    (stage: TrackingStage | null) => dispatch({ type: "SET_TRACKING_STAGE", payload: stage }),
    []
  );

  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const placeOrderAndRecordHistory = useCallback(() => {
    if (state.cart.length === 0) {
      return null;
    }

    const orderId = `ord-${Date.now()}`;
    const etaMinutes = Math.floor(Math.random() * 8) + 28;

    const order: OrderHistoryItem = {
      id: orderId,
      lines: cloneLines(state.cart),
      total: priceBreakdown.total,
      placedAtISO: new Date().toISOString(),
      etaMinutes,
      status: "Order Received",
      restaurantName: "QuickBite Central Kitchen",
      restaurantAddress: "No. 24, Cathedral Road, Chennai",
      driverName: driverNames[Math.floor(Math.random() * driverNames.length)] || "QuickBite Rider",
    };

    dispatch({ type: "ADD_ORDER_HISTORY", payload: order });
    dispatch({ type: "SET_ACTIVE_ORDER_ID", payload: order.id });

    return order;
  }, [state.cart, priceBreakdown.total]);

  const reorderFromHistory = useCallback(
    (orderId: string) => {
      const order = state.orderHistory.find((entry) => entry.id === orderId);
      if (!order) {
        return false;
      }

      dispatch({ type: "SET_CART", payload: order.lines });
      dispatch({ type: "SET_SELECTED_CATEGORY", payload: "All" });
      dispatch({ type: "SET_SEARCH_TERM", payload: "" });

      return true;
    },
    [state.orderHistory]
  );

  const removeFavorite = useCallback(
    (favoriteId: string) => dispatch({ type: "REMOVE_FAVORITE", payload: favoriteId }),
    []
  );

  const updateProfileField = useCallback(
    (key: keyof ProfileData, value: string) =>
      dispatch({ type: "SET_PROFILE_FIELD", payload: { key, value } }),
    []
  );

  const deleteAccountDataConfirmed = useCallback(
    () => dispatch({ type: "DELETE_ACCOUNT_DATA" }),
    []
  );

  const setHighContrast = useCallback(
    (enabled: boolean) => dispatch({ type: "SET_HIGH_CONTRAST", payload: enabled }),
    []
  );

  const toggleHighContrast = useCallback(
    () => dispatch({ type: "SET_HIGH_CONTRAST", payload: !state.isHighContrast }),
    [state.isHighContrast]
  );

  const setDarkMode = useCallback(
    (enabled: boolean) => dispatch({ type: "SET_DARK_MODE", payload: enabled }),
    []
  );

  const toggleDarkMode = useCallback(
    () => dispatch({ type: "SET_DARK_MODE", payload: !state.isDarkMode }),
    [state.isDarkMode]
  );

  const setLoggedIn = useCallback(
    (status: boolean) => dispatch({ type: "SET_LOGGED_IN", payload: status }),
    []
  );

  const getActiveOrder = useCallback(() => {
    if (!state.activeOrderId) {
      return null;
    }

    return state.orderHistory.find((entry) => entry.id === state.activeOrderId) || null;
  }, [state.activeOrderId, state.orderHistory]);

  const value = useMemo<QuickBiteContextValue>(
    () => ({
      state,
      filteredItems,
      cartCount,
      priceBreakdown,
      setSearchTerm,
      setSelectedCategory,
      setSearchFilters,
      resetSearchFilters,
      addToCart,
      incrementItem,
      decrementItem,
      removeLine,
      restoreLine,
      setCheckoutField,
      toggleHamburger,
      closeHamburger,
      setOrderModalOpen,
      setTrackingStage,
      clearCart,
      placeOrderAndRecordHistory,
      reorderFromHistory,
      removeFavorite,
      updateProfileField,
      deleteAccountDataConfirmed,
      getActiveOrder,
      isHighContrast: state.isHighContrast,
      setHighContrast,
      toggleHighContrast,
      isDarkMode: state.isDarkMode,
      setDarkMode,
      toggleDarkMode,
      isLoggedIn: state.isLoggedIn,
      setLoggedIn,
    }),
    [
      state,
      filteredItems,
      cartCount,
      priceBreakdown,
      setSearchTerm,
      setSelectedCategory,
      setSearchFilters,
      resetSearchFilters,
      addToCart,
      incrementItem,
      decrementItem,
      removeLine,
      restoreLine,
      setCheckoutField,
      toggleHamburger,
      closeHamburger,
      setOrderModalOpen,
      setTrackingStage,
      clearCart,
      placeOrderAndRecordHistory,
      reorderFromHistory,
      removeFavorite,
      updateProfileField,
      deleteAccountDataConfirmed,
      getActiveOrder,
      setHighContrast,
      toggleHighContrast,
      setDarkMode,
      toggleDarkMode,
      setLoggedIn,
    ]
  );

  return <QuickBiteContext.Provider value={value}>{children}</QuickBiteContext.Provider>;
};

export const useQuickBite = () => {
  const context = useContext(QuickBiteContext);
  if (!context) {
    throw new Error("useQuickBite must be used within QuickBiteProvider");
  }
  return context;
};

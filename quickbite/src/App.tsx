// App.tsx - root routing shell.
// BottomNav added for mobile (Fitts's Law, Serial Position Effect).
// New routes: /accessibility (Universal Design) and /reviews (Cialdini Social Proof).

import { Navigate, Route, Routes } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import GlobalUsabilityLayer from "./components/GlobalUsabilityLayer";
import HamburgerMenu from "./components/HamburgerMenu";
import AccessibilityScreen from "./screens/AccessibilityScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import HelpSupportScreen from "./screens/HelpSupportScreen";
import HomeScreen from "./screens/HomeScreen";
import MenuScreen from "./screens/MenuScreen";
import ProfileHistoryScreen from "./screens/ProfileHistoryScreen";
import ReviewsScreen from "./screens/ReviewsScreen";
import SearchFilterScreen from "./screens/SearchFilterScreen";
import TrackingScreen from "./screens/TrackingScreen";
import AuthScreen from "./screens/AuthScreen";

const App = () => {
  return (
    <>
      <HamburgerMenu />
      <GlobalUsabilityLayer />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/menu" element={<MenuScreen />} />
        <Route path="/search" element={<SearchFilterScreen />} />
        <Route path="/checkout" element={<CheckoutScreen />} />
        <Route path="/tracking" element={<TrackingScreen />} />
        <Route path="/profile" element={<ProfileHistoryScreen />} />
        <Route path="/help" element={<HelpSupportScreen />} />
        <Route path="/accessibility" element={<AccessibilityScreen />} />
        <Route path="/reviews" element={<ReviewsScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* Mobile-only bottom navigation - hidden on md+ screens via CSS */}
      <BottomNav />
    </>
  );
};

export default App;

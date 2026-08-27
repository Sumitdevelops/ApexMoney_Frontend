/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Capacitor } from "@capacitor/core";
import {
  initRevenueCat,
  identifyUser,
  logoutRevenueCat,
  getCurrentTier,
} from "../services/revenueCat.service";
import PaywallModal from "../components/subscriptions/PaywallModal";

const UserContext = createContext();

// Tier hierarchy for comparison helpers
const TIER_ORDER = ["free", "pro", "ai_pro", "business"];

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState("free");
  const api_url = import.meta.env.VITE_BACKENDURL;

  // Paywall modal state
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallConfig, setPaywallConfig] = useState({
    requiredTier: "ai_pro",
    featureName: "this feature",
  });

  // ── RevenueCat init (once on app load) ──
  useEffect(() => {
    const rcKey = import.meta.env.VITE_REVENUECAT_API_KEY;
    if (rcKey && Capacitor.isNativePlatform()) {
      initRevenueCat(rcKey);
    }
  }, []);

  // ── Auth initialisation ──
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if there's a one-time OAuth token in the URL (from Google sign-in redirect)
        const params = new URLSearchParams(window.location.search);
        const oauthToken = params.get("token");

        if (oauthToken) {
          // Exchange the one-time token for user data + session
          const res = await axios.post(
            `${api_url}/auth/exchange-token`,
            { token: oauthToken },
            { timeout: 15000, withCredentials: true }
          );
          setUser(res.data.user);
          setSubscriptionTier(res.data.user?.subscriptionTier || "free");

          // Remove the token from the URL without reloading
          const url = new URL(window.location.href);
          url.searchParams.delete("token");
          window.history.replaceState({}, "", url.pathname);
          return;
        }

        // No OAuth token — check existing session
        const res = await axios.get(`${api_url}/user/session`, {
          timeout: 10000,
          withCredentials: true,
        });
        setUser(res.data.user);
        setSubscriptionTier(res.data.user?.subscriptionTier || "free");
      } catch (err) {
        console.error("Auth init failed:", err.response?.data || err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [api_url]);

  // ── Identify user to RevenueCat after login ──
  useEffect(() => {
    if (user?._id && Capacitor.isNativePlatform()) {
      identifyUser(user._id).then(async () => {
        // Sync tier from RevenueCat entitlements
        const rcTier = await getCurrentTier();
        if (rcTier !== "free") {
          setSubscriptionTier(rcTier);
        }
      });
    }
  }, [user]);

  // ── Fetch subscription status from backend ──
  const refreshSubscriptionStatus = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${api_url}/webhooks/subscription-status`, {
        withCredentials: true,
      });
      setSubscriptionTier(res.data.tier || "free");
    } catch (err) {
      console.error("Failed to fetch subscription status:", err);
    }
  }, [user, api_url]);

  const signup = async (userData) => {
    const res = await axios.post(`${api_url}/user/signup`, userData, {
      timeout: 15000,
      withCredentials: true,
    });

    setUser(res.data.User);
    setSubscriptionTier(res.data.User?.subscriptionTier || "free");
  };

  const login = (userData) => {
    setUser(userData);
    setSubscriptionTier(userData?.subscriptionTier || "free");
  };

  const logout = async () => {
    await axios.post(`${api_url}/user/logout`, null, {
      timeout: 10000,
      withCredentials: true,
    });
    setUser(null);
    setSubscriptionTier("free");

    // Logout from RevenueCat
    if (Capacitor.isNativePlatform()) {
      await logoutRevenueCat();
    }
  };

  // ── Subscription helpers ──
  const tierIndex = TIER_ORDER.indexOf(subscriptionTier);
  const isPro = tierIndex >= TIER_ORDER.indexOf("pro");
  const isAIPro = tierIndex >= TIER_ORDER.indexOf("ai_pro");
  const isBusiness = tierIndex >= TIER_ORDER.indexOf("business");

  /**
   * Call this to check if the user has access to a feature.
   * If they don't, the paywall modal opens automatically.
   *
   * @param {string} requiredTier - 'pro' | 'ai_pro'
   * @param {string} featureName - Human-readable feature name
   * @returns {boolean} - true if user has access, false if paywall was shown
   */
  const requireTierOrPaywall = useCallback(
    (requiredTier, featureName = "this feature") => {
      const required = TIER_ORDER.indexOf(requiredTier);
      if (tierIndex >= required) return true;

      // Show paywall
      setPaywallConfig({ requiredTier, featureName });
      setPaywallOpen(true);
      return false;
    },
    [tierIndex]
  );

  const handlePurchaseSuccess = (tier) => {
    setSubscriptionTier(tier);
    setPaywallOpen(false);
    // Also refresh from backend to ensure consistency
    refreshSubscriptionStatus();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        // Subscription helpers
        subscriptionTier,
        isPro,
        isAIPro,
        isBusiness,
        requireTierOrPaywall,
        refreshSubscriptionStatus,
      }}
    >
      {children}

      {/* Global Paywall Modal */}
      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        requiredTier={paywallConfig.requiredTier}
        featureName={paywallConfig.featureName}
        onPurchaseSuccess={handlePurchaseSuccess}
      />
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);


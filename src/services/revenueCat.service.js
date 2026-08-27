/**
 * RevenueCat Service — wraps @revenuecat/purchases-capacitor for ApexMoney.
 *
 * This service handles:
 *   - SDK initialisation (called once on app launch)
 *   - User identification (called after login)
 *   - Fetching offerings / available packages
 *   - Purchasing a package (triggers Google Play Sheet)
 *   - Restoring purchases (mandatory for Play Store compliance)
 *   - Checking current entitlements
 *
 * On web/desktop the SDK is a no-op so the app doesn't crash.
 */

import { Capacitor } from '@capacitor/core';

// We lazy-import the SDK so Vite tree-shakes it on web builds
let Purchases = null;
let LOG_LEVEL = null;

const isNative = () => Capacitor.isNativePlatform();

/**
 * Initialise RevenueCat. Call this once in main.jsx or App.jsx.
 *
 * @param {string} apiKey  - Your RevenueCat Public API Key (Google Play)
 *                           Set via VITE_REVENUECAT_API_KEY in .env
 */
export const initRevenueCat = async (apiKey) => {
    if (!isNative()) {
        console.log('[RevenueCat] Skipping init — not a native platform');
        return;
    }

    try {
        const mod = await import('@revenuecat/purchases-capacitor');
        Purchases = mod.Purchases;
        LOG_LEVEL = mod.LOG_LEVEL;

        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
        await Purchases.configure({ apiKey });
        console.log('[RevenueCat] SDK configured');
    } catch (err) {
        console.error('[RevenueCat] Init error:', err);
    }
};

/**
 * Identify the current user to RevenueCat.
 * We use the MongoDB _id so webhook events carry the same ID.
 *
 * @param {string} userId - MongoDB user _id
 */
export const identifyUser = async (userId) => {
    if (!isNative() || !Purchases) return;

    try {
        const { customerInfo } = await Purchases.logIn({ appUserID: userId });
        console.log('[RevenueCat] User identified:', userId);
        return customerInfo;
    } catch (err) {
        console.error('[RevenueCat] logIn error:', err);
        return null;
    }
};

/**
 * Log out the RevenueCat user (call on app logout).
 */
export const logoutRevenueCat = async () => {
    if (!isNative() || !Purchases) return;

    try {
        await Purchases.logOut();
        console.log('[RevenueCat] User logged out');
    } catch (err) {
        console.error('[RevenueCat] logOut error:', err);
    }
};

/**
 * Fetch available subscription offerings (products + pricing).
 * Returns the current offering's available packages.
 *
 * @returns {Array} packages — each with { identifier, product, packageType, ... }
 */
export const getOfferings = async () => {
    if (!isNative() || !Purchases) return [];

    try {
        const offerings = await Purchases.getOfferings();

        if (!offerings.current || !offerings.current.availablePackages.length) {
            console.warn('[RevenueCat] No offerings configured');
            return [];
        }

        return offerings.current.availablePackages;
    } catch (err) {
        console.error('[RevenueCat] getOfferings error:', err);
        return [];
    }
};

/**
 * Purchase a specific package.
 * This triggers the native Google Play purchase sheet.
 *
 * @param {object} pkg - A package object from getOfferings()
 * @returns {{ customerInfo, productIdentifier } | null}
 */
export const purchasePackage = async (pkg) => {
    if (!isNative() || !Purchases) {
        console.warn('[RevenueCat] Cannot purchase on web — use web checkout instead');
        return null;
    }

    try {
        const result = await Purchases.purchasePackage({ aPackage: pkg });
        console.log('[RevenueCat] Purchase success:', result.productIdentifier);
        return result;
    } catch (err) {
        // User cancelled is not an error
        if (err.userCancelled) {
            console.log('[RevenueCat] Purchase cancelled by user');
            return null;
        }
        console.error('[RevenueCat] Purchase error:', err);
        throw err;
    }
};

/**
 * Restore previous purchases (mandatory for Play Store).
 *
 * @returns {object|null} customerInfo
 */
export const restorePurchases = async () => {
    if (!isNative() || !Purchases) return null;

    try {
        const { customerInfo } = await Purchases.restorePurchases();
        console.log('[RevenueCat] Purchases restored');
        return customerInfo;
    } catch (err) {
        console.error('[RevenueCat] Restore error:', err);
        throw err;
    }
};

/**
 * Get the current customer info and active entitlements.
 *
 * @returns {object|null} customerInfo
 */
export const getCustomerInfo = async () => {
    if (!isNative() || !Purchases) return null;

    try {
        const { customerInfo } = await Purchases.getCustomerInfo();
        return customerInfo;
    } catch (err) {
        console.error('[RevenueCat] getCustomerInfo error:', err);
        return null;
    }
};

/**
 * Check if the user has a specific entitlement active.
 *
 * @param {string} entitlementId - e.g. 'pro', 'ai_pro'
 * @returns {boolean}
 */
export const hasEntitlement = async (entitlementId) => {
    const info = await getCustomerInfo();
    if (!info) return false;

    const entitlement = info.entitlements?.active?.[entitlementId];
    return !!entitlement && entitlement.isActive;
};

/**
 * Determine the user's current tier from active entitlements.
 *
 * @returns {'free' | 'pro' | 'ai_pro' | 'business'}
 */
export const getCurrentTier = async () => {
    const info = await getCustomerInfo();
    if (!info) return 'free';

    const active = info.entitlements?.active || {};

    if (active['business']) return 'business';
    if (active['ai_pro']) return 'ai_pro';
    if (active['pro']) return 'pro';
    return 'free';
};

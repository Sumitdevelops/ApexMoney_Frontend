import { useState, useEffect, useRef } from 'react';

/**
 * Detects if the app is running inside Capacitor (native mobile) or in a browser.
 * Also detects small-screen mobile browsers for responsive layout.
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    // Check Capacitor native first
    if (window.Capacitor?.isNativePlatform()) return true;
    // Fallback: check screen width for mobile browsers
    return window.innerWidth < 768;
  });
  const resizeTimer = useRef(null);

  useEffect(() => {
    // If native, always mobile
    if (window.Capacitor?.isNativePlatform()) {
      setIsMobile(true);
      return;
    }

    // Debounced resize handler — 150ms delay prevents rapid-fire re-renders
    const handleResize = () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
    };
  }, []);

  return isMobile;
};

export const isNativePlatform = () => {
  return !!window.Capacitor?.isNativePlatform();
};

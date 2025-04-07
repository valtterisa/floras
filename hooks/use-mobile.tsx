"use client";

import { useState, useEffect } from "react";

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (to avoid SSR issues)
    if (typeof window !== "undefined") {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768); // Consider screens smaller than 768px as mobile
      };

      // Initial check
      checkIfMobile();

      // Add event listener for window resize
      window.addEventListener("resize", checkIfMobile);

      // Clean up
      return () => window.removeEventListener("resize", checkIfMobile);
    }
  }, []);

  return isMobile;
}

"use client";

import { useState, useEffect } from "react";

interface ClientFormattedDateProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  date: Date | string | number | null | undefined; // Allow null/undefined
  options: Intl.DateTimeFormatOptions;
  type: "date" | "time" | "datetime";
  fallbackFormat?: Intl.DateTimeFormatOptions; // Optional specific fallback
  locale?: string | string[]; // Optional specific locale
}

/**
 * Renders a date/time formatted using the client's locale after hydration.
 * Provides a stable, non-locale-specific fallback during SSR and initial hydration
 * to prevent mismatches. Handles invalid or null/undefined date inputs gracefully.
 */
export function ClientFormattedDate({
  date,
  options,
  type,
  fallbackFormat,
  locale,
  ...props
}: ClientFormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Validate input date *before* creating Date object
  const isValidInput = date !== null && date !== undefined;
  const dateObj = isValidInput ? new Date(date) : null;
  const isValidDate = dateObj instanceof Date && !isNaN(dateObj.getTime());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only format if mounted and the date is valid
    if (isMounted && isValidDate && dateObj) {
      const formatFunc =
        type === "date"
          ? dateObj.toLocaleDateString.bind(dateObj) // Bind to ensure correct 'this'
          : type === "time"
            ? dateObj.toLocaleTimeString.bind(dateObj)
            : dateObj.toLocaleString.bind(dateObj);

      try {
        setFormattedDate(formatFunc(locale, options));
      } catch (error) {
        console.error("Error formatting date:", error, {
          date,
          options,
          type,
          locale,
        });
        // Fallback to basic formatting in case of error
        const fallbackOptions =
          fallbackFormat || getDefaultFallbackOptions(type);
        const fallbackFunc = getFallbackFormatFunc(type, dateObj);
        if (fallbackFunc) {
          try {
            setFormattedDate(fallbackFunc("en-US", fallbackOptions));
          } catch (fallbackError) {
            console.error(
              "Error during client fallback formatting:",
              fallbackError
            );
            setFormattedDate(""); // Final fallback
          }
        } else {
          setFormattedDate(""); // Provide a clear fallback
        }
      }
    } else if (isMounted && !isValidDate) {
      // Handle invalid date case explicitly after mount
      setFormattedDate(""); // Render empty for invalid dates after mount
    }
    // Ensure dependencies cover all cases, including validity change
  }, [dateObj, options, type, locale, isMounted, isValidDate, fallbackFormat]);

  // Helper to get default fallback options
  const getDefaultFallbackOptions = (
    type: "date" | "time" | "datetime"
  ): Intl.DateTimeFormatOptions => {
    return type === "date"
      ? { year: "numeric", month: "numeric", day: "numeric" }
      : type === "time"
        ? { hour: "numeric", minute: "numeric", hour12: false }
        : {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          };
  };

  // Helper to get fallback formatting function safely
  const getFallbackFormatFunc = (
    type: "date" | "time" | "datetime",
    dateObj: Date | null
  ):
    | ((
        locales?: string | string[],
        options?: Intl.DateTimeFormatOptions
      ) => string)
    | null => {
    // Check if dateObj is valid before accessing methods
    if (!(dateObj instanceof Date && !isNaN(dateObj.getTime()))) return null;
    return type === "date"
      ? dateObj.toLocaleDateString.bind(dateObj)
      : type === "time"
        ? dateObj.toLocaleTimeString.bind(dateObj)
        : dateObj.toLocaleString.bind(dateObj);
  };

  // Determine fallback content for SSR/initial render
  let ssrFallbackContent = "";
  if (isValidDate && dateObj) {
    const effectiveFallbackOptions =
      fallbackFormat || getDefaultFallbackOptions(type);
    const fallbackFormatFunc = getFallbackFormatFunc(type, dateObj);
    if (fallbackFormatFunc) {
      try {
        ssrFallbackContent = fallbackFormatFunc(
          "en-US",
          effectiveFallbackOptions
        );
      } catch (e) {
        console.error("Error during SSR fallback formatting:", e);
        ssrFallbackContent = ""; // Fallback to empty if even SSR formatting fails
      }
    }
  }

  // Render client-formatted date once available, otherwise the SSR fallback
  // If not mounted, show SSR fallback. If mounted, show formattedDate (or empty string if null/invalid)
  const content = isMounted ? (formattedDate ?? "") : ssrFallbackContent;

  return <span {...props}>{content}</span>;
}

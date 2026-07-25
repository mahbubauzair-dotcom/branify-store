"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/** Currency definition with exchange rate relative to USD. */
export type Currency = {
  code: string;
  symbol: string;
  name: string;
  rate: number; // 1 USD = rate * currency
  flag: string;
  countries: string[];
};

/** All supported currencies. Rates are approximate (update periodically). */
export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1, flag: "🇺🇸", countries: ["US"] },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.5, flag: "🇮🇳", countries: ["IN"] },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.52, flag: "🇦🇺", countries: ["AU"] },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.37, flag: "🇨🇦", countries: ["CA"] },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", rate: 1.34, flag: "🇸🇬", countries: ["SG"] },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", rate: 278, flag: "🇵🇰", countries: ["PK"] },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", rate: 117, flag: "🇧🇩", countries: ["BD"] },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 3.67, flag: "🇦🇪", countries: ["AE"] },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", rate: 3.75, flag: "🇸🇦", countries: ["SA"] },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal", rate: 3.64, flag: "🇶🇦", countries: ["QA"] },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92, flag: "🇪🇺", countries: ["DE", "FR", "ES", "IT", "NL", "BE", "AT", "PT", "IE", "FI", "GR"] },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79, flag: "🇬🇧", countries: ["GB"] },
];

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (code: string) => void;
  /** Convert a USD price to the active currency and format it. */
  format: (usdPrice: number) => string;
  /** Convert a USD price to the active currency (raw number). */
  convert: (usdPrice: number) => number;
  /** All available currencies. */
  currencies: Currency[];
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = "branify:currency";

/** Detect the user's currency from their timezone/locale (no external API). */
function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    // Map timezone to country code
    const tzMap: Record<string, string> = {
      "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US",
      "America/Los_Angeles": "US", "America/Anchorage": "US", "Pacific/Honolulu": "US",
      "Asia/Karachi": "PK", "Asia/Dhaka": "BD", "Asia/Kolkata": "IN",
      "Asia/Calcutta": "IN", "Asia/Singapore": "SG",
      "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU",
      "America/Toronto": "CA", "America/Vancouver": "CA", "America/Montreal": "CA",
      "Asia/Dubai": "AE", "Asia/Riyadh": "SA", "Asia/Qatar": "QA",
      "Europe/London": "GB", "Europe/Paris": "DE", "Europe/Berlin": "DE",
      "Europe/Madrid": "ES", "Europe/Rome": "IT", "Europe/Amsterdam": "NL",
    };
    const countryCode = tzMap[tz];
    if (countryCode) {
      const found = CURRENCIES.find((c) => c.countries.includes(countryCode));
      if (found) return found;
    }
    // Try locale
    const locale = navigator.language || "en-US";
    const region = locale.split("-")[1]?.toUpperCase();
    if (region) {
      const found = CURRENCIES.find((c) => c.countries.includes(region));
      if (found) return found;
    }
  } catch {
    /* ignore */
  }
  return CURRENCIES[0]; // USD fallback
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: detect currency on first render (client-side only)
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window === "undefined") return CURRENCIES[0];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const found = CURRENCIES.find((c) => c.code === saved);
        if (found) return found;
      }
      const detected = detectCurrency();
      localStorage.setItem(STORAGE_KEY, detected.code);
      return detected;
    } catch {
      return CURRENCIES[0];
    }
  });

  const setCurrency = (code: string) => {
    const found = CURRENCIES.find((c) => c.code === code);
    if (found) {
      setCurrencyState(found);
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        /* ignore */
      }
    }
  };

  const convert = (usdPrice: number): number => {
    return Math.round(usdPrice * currency.rate * 100) / 100;
  };

  const format = (usdPrice: number): string => {
    const converted = convert(usdPrice);
    // Format with appropriate decimal places
    const decimals = converted < 100 ? 2 : 0;
    const formatted = converted.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${currency.symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, convert, currencies: CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
}

/** Hook to access the currency context. Must be used inside CurrencyProvider. */
export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Fallback to USD if no provider (shouldn't happen in practice)
    const usd = CURRENCIES[0];
    return {
      currency: usd,
      setCurrency: () => {},
      format: (p) => `$${p}`,
      convert: (p) => p,
      currencies: CURRENCIES,
    };
  }
  return ctx;
}

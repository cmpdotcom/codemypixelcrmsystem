"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type SettingsMap = Record<string, string>;

interface SettingsContextValue {
  settings: SettingsMap;
  loaded: boolean;
  refresh: () => Promise<void>;
  /** Company display name (general or company settings) */
  companyName: string;
  /** Logo URL (company settings) with /logo.png fallback */
  logoUrl: string;
  /** ISO currency code parsed from the "currency" setting, e.g. "USD" */
  currencyCode: string;
  /** Format a number as money honoring the configured currency */
  money: (n: number) => string;
  /** Format a number as compact money for chart axes, e.g. $12k / ৳12k */
  moneyCompact: (n: number) => string;
  /** Format a date string honoring the configured dateFormat */
  formatDate: (d: string | Date | null | undefined) => string;
  /** Route for the configured default landing page */
  landingRoute: string;
  /** Default deals board view: "kanban" | "list" */
  dealView: "kanban" | "list";
  /** Default pagination size */
  pageSize: number;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const LANDING_ROUTES: Record<string, string> = {
  Dashboard: "/",
  Leads: "/leads",
  Deals: "/deals",
  Activities: "/activities",
  Clients: "/clients",
};

function parseCurrencyCode(currency?: string): string {
  const match = currency?.match(/^([A-Z]{3})/);
  return match?.[1] || "USD";
}

function makeDateFormatter(format?: string) {
  return (d: string | Date | null | undefined): string => {
    if (!d) return "—";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "—";
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    switch (format) {
      case "MM/DD/YYYY":
        return `${mm}/${dd}/${yyyy}`;
      case "YYYY-MM-DD":
        return `${yyyy}-${mm}-${dd}`;
      case "DD/MM/YYYY":
      default:
        return `${dd}/${mm}/${yyyy}`;
    }
  };
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) setSettings(await res.json());
    } catch {
      // keep defaults
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Re-sync when settings are saved anywhere in the app
    const onSaved = () => refresh();
    window.addEventListener("cmp:settings-saved", onSaved);
    return () => window.removeEventListener("cmp:settings-saved", onSaved);
  }, [refresh]);

  const currencyCode = parseCurrencyCode(settings.currency);
  const formatDate = makeDateFormatter(settings.dateFormat);

  const money = useCallback(
    (n: number) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 0,
      }).format(n),
    [currencyCode]
  );

  const moneyCompact = useCallback(
    (n: number) => {
      const symbol =
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currencyCode,
          currencyDisplay: "narrowSymbol",
          maximumFractionDigits: 0,
        })
          .formatToParts(0)
          .find((p) => p.type === "currency")?.value || "$";
      return n >= 1000 ? `${symbol}${(n / 1000).toFixed(0)}k` : `${symbol}${n}`;
    },
    [currencyCode]
  );

  const value: SettingsContextValue = {
    settings,
    loaded,
    refresh,
    companyName: settings.company_name || settings.companyName || "CMP CRM",
    logoUrl: settings.company_logoUrl || "/logo.png",
    currencyCode,
    money,
    moneyCompact,
    formatDate,
    landingRoute: LANDING_ROUTES[settings.landingPage || "Dashboard"] || "/",
    dealView: settings.dealView === "List" || settings.dealView === "Table" ? "list" : "kanban",
    pageSize: parseInt(settings.pageSize) || 10,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    // Outside the dashboard (login/signup) — return safe defaults
    const formatDate = makeDateFormatter();
    return {
      settings: {},
      loaded: false,
      refresh: async () => {},
      companyName: "CMP CRM",
      logoUrl: "/logo.png",
      currencyCode: "USD",
      money: (n) => `$${n.toLocaleString()}`,
      moneyCompact: (n) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`),
      formatDate,
      landingRoute: "/",
      dealView: "kanban",
      pageSize: 10,
    };
  }
  return ctx;
}

/** Notify all mounted providers that settings changed (call after a successful save) */
export function notifySettingsSaved() {
  window.dispatchEvent(new Event("cmp:settings-saved"));
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { posSettingsAPI } from "../services/api";

interface POSSettings {
  enableQuickSale: boolean;
  enableSplitPayment: boolean;
  enableParkSale: boolean;
  enableCustomerSearch: boolean;
  enableBarcodeScanner: boolean;
  enableLoyaltyPoints: boolean;
  taxRate: number;
  receiptFooterText: string | null;
}

interface SettingsContextType {
  settings: POSSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<POSSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const data = await posSettingsAPI.get();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load POS settings:", error);
      // Set default values if loading fails
      setSettings({
        enableQuickSale: true,
        enableSplitPayment: true,
        enableParkSale: true,
        enableCustomerSearch: true,
        enableBarcodeScanner: true,
        enableLoyaltyPoints: true,
        taxRate: 0,
        receiptFooterText: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const refreshSettings = async () => {
    await loadSettings();
  };

  return <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>{children}</SettingsContext.Provider>;
};

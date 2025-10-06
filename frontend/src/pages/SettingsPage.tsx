import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BackButton } from "../components/common";
import AlertsTab from "../components/settings/AlertsTab";
import FeaturesTab from "../components/settings/FeaturesTab";
import FinanceTab from "../components/settings/FinanceTab";
import ProfileTab from "../components/settings/ProfileTab";
import ReceiptTab from "../components/settings/ReceiptTab";
import StoreTab from "../components/settings/StoreTab";
import SystemTab from "../components/settings/SystemTab";
import { useAuth } from "../context/AuthContext";
import { changePin, posSettingsAPI, updateProfile } from "../services/api";

interface POSSettings {
  id: number;
  // Feature Toggles
  enableQuickSale: boolean;
  enableSplitPayment: boolean;
  enableParkSale: boolean;
  enableCustomerSearch: boolean;
  enableBarcodeScanner: boolean;
  enableLoyaltyPoints: boolean;
  loyaltyPointsPerUnit: number;
  pointsRedemptionRate: number;

  // Store Information
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  taxId: string | null;

  // Currency & Tax
  taxRate: number;
  currencyCode: string;
  currencySymbol: string;
  currencyPosition: string;

  // Receipt Settings
  receiptFooterText: string | null;
  returnPolicy: string | null;
  printReceiptAuto: boolean;
  autoPrintThermal: boolean;

  // Alerts & Notifications
  enableLowStockAlerts: boolean;
  lowStockThreshold: number;
  enableHighStockAlerts?: boolean;
  highStockThreshold?: number;
  enableProductExpiryAlerts?: boolean;
  productExpiryDays?: number;
  dailySalesTargetAlertEnabled?: boolean;
  dailySalesTargetAmount?: number;
  priceChangeAlertEnabled?: boolean;
  supplierDeliveryAlertEnabled?: boolean;
  expectedDeliveryDays?: number;
  inactiveProductAlertEnabled?: boolean;
  inactiveProductDays?: number;
  lowBalanceAlertEnabled?: boolean;
  lowBalanceThreshold?: number;
  frequentRefundsAlertEnabled?: boolean;
  frequentRefundsThreshold?: number;
  loyaltyPointsExpiryAlertEnabled?: boolean;
  loyaltyPointsExpiryDays?: number;
  systemErrorAlertEnabled?: boolean;

  // System Settings
  autoLogoutMinutes: number;
  requirePasswordOnVoid: boolean;
  enableAuditLog: boolean;
  productsPerPage: number;
  defaultView: string;
  showProductImages: boolean;

  updatedAt: string;
  updatedByEmployee?: {
    id: number;
    name: string;
    username: string;
  };
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<POSSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("profile");
  // Profile management state
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [pinMsg, setPinMsg] = useState("");
  const [pinSaving, setPinSaving] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg("");
    try {
      const updated = await updateProfile({ name, username });
      setUser && setUser(updated);
      setProfileMsg("Profile updated successfully.");
    } catch (err: any) {
      setProfileMsg(err?.response?.data?.error || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePinChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinSaving(true);
    setPinMsg("");
    try {
      await changePin({ currentPin, newPin });
      setPinMsg("PIN changed successfully.");
      setCurrentPin("");
      setNewPin("");
    } catch (err: any) {
      setPinMsg(err?.response?.data?.error || "Failed to change PIN");
    } finally {
      setPinSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await posSettingsAPI.get();
      setSettings(data);
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (field: keyof POSSettings, value: boolean) => {
    if (!settings) return;

    try {
      setSaving(true);
      const updatedSettings = await posSettingsAPI.update({ [field]: value });
      setSettings(updatedSettings);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTextFieldChange = async (
    field: keyof POSSettings,
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!settings) return;

    const value = e.target.value.trim();

    try {
      setSaving(true);
      const updatedSettings = await posSettingsAPI.update({ [field]: value || undefined });
      setSettings(updatedSettings);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleNumberFieldChange = async (
    field: keyof POSSettings,
    e: React.FocusEvent<HTMLInputElement>,
    min?: number,
    max?: number
  ) => {
    if (!settings) return;

    const value = parseFloat(e.target.value);
    if (isNaN(value) || (min !== undefined && value < min) || (max !== undefined && value > max)) {
      toast.error(`Value must be between ${min || 0} and ${max || "unlimited"}`);
      return;
    }

    try {
      setSaving(true);
      const updatedSettings = await posSettingsAPI.update({ [field]: value });
      setSettings(updatedSettings);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSelectChange = async (field: keyof POSSettings, value: string) => {
    if (!settings) return;

    try {
      setSaving(true);
      const updatedSettings = await posSettingsAPI.update({ [field]: value });
      setSettings(updatedSettings);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  // Handler adapters for tab components
  const handleToggleString = (field: string, value: boolean) => {
    handleToggle(field as keyof POSSettings, value);
  };
  const handleTextFieldChangeString = (field: string, e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleTextFieldChange(field as keyof POSSettings, e);
  };
  const handleNumberFieldChangeString = (
    field: string,
    e: React.FocusEvent<HTMLInputElement>,
    min?: number,
    max?: number
  ) => {
    handleNumberFieldChange(field as keyof POSSettings, e, min, max);
  };
  const handleSelectChangeString = (field: string, value: string) => {
    handleSelectChange(field as keyof POSSettings, value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load settings</p>
          <button onClick={loadSettings} className="mt-4 text-blue-600 hover:text-blue-800">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <BackButton to="/admin" />
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">⚙️ POS Settings</h1>
              <p className="text-gray-600 mt-1">Configure point of sale system features and preferences</p>
            </div>
            {settings.updatedByEmployee && (
              <div className="text-sm text-gray-500 text-right">
                <p>
                  Last updated by: <span className="font-medium">{settings.updatedByEmployee.name}</span>
                </p>
                <p>{new Date(settings.updatedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("profile")}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                🙍 Profile
              </button>
              <button
                onClick={() => setActiveTab("features")}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "features"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                🎯 POS Features
              </button>
              <button
                onClick={() => setActiveTab("store")}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "store"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                🏪 Store Info
              </button>
              <button
                onClick={() => setActiveTab("receipt")}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "receipt"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                🧾 Receipts
              </button>
              <button
                onClick={() => setActiveTab("finance")}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "finance"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                💰 Tax & Currency
              </button>
              <button
                onClick={() => setActiveTab("alerts")}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "alerts"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                🔔 Alerts
              </button>
              <button
                onClick={() => setActiveTab("system")}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "system"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                ⚙️ System
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <ProfileTab
            user={user}
            name={name}
            setName={setName}
            username={username}
            setUsername={setUsername}
            savingProfile={savingProfile}
            profileMsg={profileMsg}
            handleProfileSave={handleProfileSave}
            currentPin={currentPin}
            setCurrentPin={setCurrentPin}
            newPin={newPin}
            setNewPin={setNewPin}
            pinMsg={pinMsg}
            pinSaving={pinSaving}
            handlePinChange={handlePinChange}
          />
        )}
        {activeTab === "features" && (
          <FeaturesTab
            settings={settings}
            saving={saving}
            handleToggle={handleToggleString}
            setSelectedFeature={setSelectedFeature}
            setShowInfoModal={setShowInfoModal}
            showInfoModal={showInfoModal}
            selectedFeature={selectedFeature}
          />
        )}
        {activeTab === "store" && (
          <StoreTab settings={settings} saving={saving} handleTextFieldChange={handleTextFieldChangeString} />
        )}
        {activeTab === "receipt" && (
          <ReceiptTab
            settings={settings}
            saving={saving}
            handleToggle={handleToggleString}
            handleTextFieldChange={handleTextFieldChangeString}
          />
        )}
        {activeTab === "finance" && (
          <FinanceTab
            settings={settings}
            saving={saving}
            handleNumberFieldChange={handleNumberFieldChangeString}
            handleSelectChange={handleSelectChangeString}
          />
        )}
        {activeTab === "alerts" && (
          <AlertsTab
            settings={settings}
            saving={saving}
            handleSwitchChange={handleToggleString}
            handleNumberFieldChange={handleNumberFieldChangeString}
            handleSelectChange={handleSelectChangeString}
          />
        )}
        {activeTab === "system" && (
          <SystemTab
            settings={settings}
            saving={saving}
            handleSwitchChange={handleToggleString}
            handleNumberFieldChange={handleNumberFieldChangeString}
            handleSelectChange={handleSelectChangeString}
          />
        )}
      </div>
    </div>
  );
};

export default SettingsPage;

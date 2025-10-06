// Daily Sales Target Alert (frontend state, add to POSSettings interface if not present)
// Add to interface if not present:
// dailySalesTargetAlertEnabled?: boolean;
// dailySalesTargetAmount?: number;
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePin } from "../services/api";
import { Card, CardHeader, CardBody, CardFooter } from "../components/common/Card";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { posSettingsAPI } from "../services/api";
import { BackButton } from "../components/common";
import { getCurrencyOptions, getCurrencyConfig } from "../config/currencyConfig";

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

  const featureToggles = [
    {
      key: "enableQuickSale" as keyof POSSettings,
      title: "Quick Sale Buttons",
      description: "Enable quick access buttons for frequently sold products on POS",
      icon: "⚡",
      detailedInfo: {
        whatIs:
          "Quick Sale feature allows you to create customizable buttons for your most frequently sold products, providing instant access without searching.",
        howItWorks: [
          "Admin creates Quick Sale items from the Products page",
          "These items appear as buttons at the top of the POS interface",
          "Cashiers can add products to cart with a single click",
          "Ideal for fast-moving items like coffee, snacks, or common services",
        ],
        whenToUse: "Enable when you have high-volume, repeat products that need quick access",
        whenToDisable: "Disable during training periods or if your inventory changes frequently",
      },
    },
    {
      key: "enableSplitPayment" as keyof POSSettings,
      title: "Split Payment",
      description: "Allow customers to pay using multiple payment methods",
      icon: "💳",
      detailedInfo: {
        whatIs:
          "Split Payment allows customers to divide a single transaction across multiple payment methods (cash, card, mobile payment, etc.).",
        howItWorks: [
          "Customer selects 'Split Payment' option at checkout",
          "Cashier specifies amount for each payment method",
          "System validates that total matches transaction amount",
          "All payment methods are recorded in the sale record",
        ],
        whenToUse: "Enable when customers commonly use multiple payment methods",
        whenToDisable: "Disable if your store policy requires single payment method only",
      },
    },
    {
      key: "enableParkSale" as keyof POSSettings,
      title: "Park Sale",
      description: "Ability to temporarily save and resume transactions",
      icon: "📦",
      detailedInfo: {
        whatIs:
          "Park Sale allows cashiers to temporarily save incomplete transactions and resume them later, freeing up the POS for other customers.",
        howItWorks: [
          "Cashier adds items to cart but customer isn't ready to pay",
          "Click 'Park Sale' to save transaction with a name/reference",
          "Transaction is stored temporarily (24 hours by default)",
          "Resume parked sale anytime from 'Parked Sales' list",
          "Complete payment when customer returns",
        ],
        whenToUse: "Enable for high-traffic stores where customers may need to step aside",
        whenToDisable: "Disable if all transactions complete immediately or you want to prevent incomplete sales",
      },
    },
    {
      key: "enableCustomerSearch" as keyof POSSettings,
      title: "Customer Search",
      description: "Search and link customers to transactions for loyalty tracking",
      icon: "👤",
      detailedInfo: {
        whatIs:
          "Customer Search enables linking transactions to customer profiles for loyalty points, purchase history, and personalized service.",
        howItWorks: [
          "Cashier enters customer phone number in POS",
          "System finds matching customer profile",
          "Transaction is linked to customer account",
          "Loyalty points are automatically calculated and awarded",
          "Customer can redeem points for discounts",
        ],
        whenToUse: "Enable if you have a loyalty program or want to track customer purchases",
        whenToDisable: "Disable for anonymous-only sales or privacy-focused businesses",
      },
    },
    {
      key: "enableBarcodeScanner" as keyof POSSettings,
      title: "Barcode Scanner",
      description: "Enable barcode scanning functionality",
      icon: "📷",
      detailedInfo: {
        whatIs:
          "Barcode Scanner input allows using physical barcode scanners or manual barcode entry to quickly add products to cart.",
        howItWorks: [
          "Physical barcode scanner connected via USB acts as keyboard",
          "Scan product barcode - item automatically added to cart",
          "Manual entry: type barcode and press Enter",
          "Autocomplete suggestions appear as you type",
          "System finds product by barcode and adds to transaction",
        ],
        whenToUse: "Enable when using barcode scanners or products have barcode labels",
        whenToDisable: "Disable if you don't use barcodes or want to prevent accidental scans",
      },
    },
    {
      key: "enableLoyaltyPoints" as keyof POSSettings,
      title: "Loyalty Points",
      description: "Enable customer loyalty points and rewards system",
      icon: "🎁",
      detailedInfo: {
        whatIs:
          "Loyalty Points system rewards customers with points for purchases, which they can redeem for discounts on future transactions.",
        howItWorks: [
          "Customers earn points based on purchase amount (configured in Loyalty Admin)",
          "Points accumulate in customer profile",
          "Different tiers (Bronze, Silver, Gold) offer different benefits",
          "Customers can redeem points for discounts at checkout",
          "Birthday rewards and special promotions available",
        ],
        whenToUse: "Enable to encourage repeat customers and increase customer retention",
        whenToDisable: "Disable if not using loyalty program or during system maintenance",
      },
    },
  ];

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
          <div className="mb-8">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-700">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">{user?.name || "User"}</div>
                    <div className="text-gray-500 text-sm">@{user?.username}</div>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                      className="input input-bordered w-full"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Username</label>
                    <input
                      className="input input-bordered w-full"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <CardFooter align="left">
                    <button className="btn btn-primary" type="submit" disabled={savingProfile}>
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </button>
                    {profileMsg && <span className="ml-3 text-green-600 text-sm">{profileMsg}</span>}
                  </CardFooter>
                </form>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Change PIN</CardHeader>
              <CardBody>
                <form onSubmit={handlePinChange} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Current PIN</label>
                    <input
                      className="input input-bordered w-full"
                      type="password"
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value)}
                      minLength={4}
                      maxLength={6}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">New PIN</label>
                    <input
                      className="input input-bordered w-full"
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      minLength={4}
                      maxLength={6}
                      required
                    />
                    <span className="text-xs text-gray-400">PIN must be 4-6 digits</span>
                  </div>
                  <CardFooter align="left">
                    <button className="btn btn-secondary" type="submit" disabled={pinSaving}>
                      {pinSaving ? "Changing..." : "Change PIN"}
                    </button>
                    {pinMsg && <span className="ml-3 text-green-600 text-sm">{pinMsg}</span>}
                  </CardFooter>
                </form>
              </CardBody>
            </Card>
          </div>
        )}
        {activeTab === "features" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">🎯 POS Feature Controls</h2>
              <p className="text-sm text-gray-600 mt-1">Enable or disable core point of sale features</p>
            </div>

            <div className="divide-y divide-gray-200">
              {featureToggles.map((feature) => (
                <div
                  key={feature.key}
                  className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-3xl">{feature.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                        <button
                          onClick={() => {
                            setSelectedFeature(feature.key);
                            setShowInfoModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View detailed information"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(feature.key, !settings[feature.key])}
                    disabled={saving}
                    className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      settings[feature.key] ? "bg-blue-600" : "bg-gray-200"
                    }`}
                    role="switch"
                    aria-checked={!!settings[feature.key]}
                  >
                    <span
                      className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings[feature.key] ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 mx-6 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Quick Tip</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Changes take effect immediately. Click the <strong>ℹ️ info icon</strong> next to each feature for
                    detailed explanations.
                  </p>
                </div>
                {/* Product Expiry Alert */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Product Expiry Alerts</h4>
                    <p className="text-sm text-gray-500">Notify when products are near expiry</p>
                  </div>
                  <button
                    onClick={() =>
                      handleToggle("enableProductExpiryAlerts", !(settings.enableProductExpiryAlerts ?? false))
                    }
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      settings.enableProductExpiryAlerts ?? false ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                        settings.enableProductExpiryAlerts ?? false ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Product Expiry Days */}
                <div>
                  <label htmlFor="productExpiryDays" className="block text-sm font-medium text-gray-700 mb-2">
                    Days Before Expiry to Alert
                  </label>
                  <input
                    type="number"
                    id="productExpiryDays"
                    min="1"
                    max="365"
                    defaultValue={settings.productExpiryDays || 7}
                    onBlur={(e) => handleNumberFieldChange("productExpiryDays", e, 1, 365)}
                    disabled={saving || !(settings.enableProductExpiryAlerts ?? false)}
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <p className="text-sm text-gray-500 mt-1">Alert when a product is within this many days of expiry</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "store" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">🏪 Store Information</h2>
              <p className="text-sm text-gray-600 mt-1">Business details displayed on receipts and reports</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  id="storeName"
                  defaultValue={settings.storeName}
                  onBlur={(e) => handleTextFieldChange("storeName", e)}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="storePhone"
                  defaultValue={settings.storePhone}
                  onBlur={(e) => handleTextFieldChange("storePhone", e)}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="storeEmail"
                  defaultValue={settings.storeEmail}
                  onBlur={(e) => handleTextFieldChange("storeEmail", e)}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID (Optional)
                </label>
                <input
                  type="text"
                  id="taxId"
                  defaultValue={settings.taxId || ""}
                  onBlur={(e) => handleTextFieldChange("taxId", e)}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Store Address
                </label>
                <textarea
                  id="storeAddress"
                  rows={2}
                  defaultValue={settings.storeAddress}
                  onBlur={(e) => handleTextFieldChange("storeAddress", e)}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "receipt" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">🧾 Receipt Settings</h2>
              <p className="text-sm text-gray-600 mt-1">Configure receipt printing options</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Receipt Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-Print Receipt</h4>
                    <p className="text-sm text-gray-500">Automatically print after sale</p>
                  </div>
                  <button
                    onClick={() => handleToggle("printReceiptAuto", !settings.printReceiptAuto)}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      settings.printReceiptAuto ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                        settings.printReceiptAuto ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Auto-Email Receipt option removed */}

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-Print Thermal Receipt</h4>
                    <p className="text-sm text-gray-500">Automatically print thermal receipt after sale</p>
                  </div>
                  <button
                    onClick={() => handleToggle("autoPrintThermal", !settings.autoPrintThermal)}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      settings.autoPrintThermal ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                        settings.autoPrintThermal ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Which option should I enable?</strong>
                  <br />
                  <ul className="list-disc list-inside mt-1 mb-1">
                    <li>
                      <strong>Auto-Print Receipt</strong>: Enable if you use a regular (A4/Letter) printer for full-page
                      receipts.
                    </li>
                    <li>
                      <strong>Auto-Print Thermal Receipt</strong>: Enable if you use a thermal receipt printer
                      (80mm/58mm) for narrow, text-based receipts.
                    </li>
                    <li>
                      <strong>Both</strong>: Enable both only if you want both receipts to print automatically after
                      each sale.
                    </li>
                  </ul>
                  Most users only need to enable the one that matches their printer.
                </p>
              </div>

              {/* Receipt Footer */}
              <div>
                <label htmlFor="receiptFooter" className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt Footer Text
                </label>
                <textarea
                  id="receiptFooter"
                  rows={3}
                  defaultValue={settings.receiptFooterText || ""}
                  onBlur={(e) => handleTextFieldChange("receiptFooterText", e)}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Thank you for shopping with us!"
                />
                <p className="text-sm text-gray-500 mt-1">Displayed at the bottom of printed receipts</p>
              </div>

              {/* Return Policy */}
              <div>
                <label htmlFor="returnPolicy" className="block text-sm font-medium text-gray-700 mb-2">
                  Return Policy Text (Optional)
                </label>
                <textarea
                  id="returnPolicy"
                  rows={3}
                  defaultValue={settings.returnPolicy || ""}
                  onBlur={(e) => handleTextFieldChange("returnPolicy", e)}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Returns accepted within 30 days with receipt"
                />
                <p className="text-sm text-gray-500 mt-1">Return policy displayed on receipts</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "finance" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">💰 Tax & Currency</h2>
              <p className="text-sm text-gray-600 mt-1">Configure pricing and tax settings</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-2">
                  Default Tax Rate (%)
                </label>
                <input
                  type="number"
                  id="taxRate"
                  min="0"
                  max="100"
                  step="0.01"
                  defaultValue={settings.taxRate}
                  onBlur={(e) => handleNumberFieldChange("taxRate", e, 0, 100)}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="0.00"
                />
                <p className="text-sm text-gray-500 mt-1">Applied to all products unless overridden</p>
              </div>

              <div>
                <label htmlFor="currencyCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  id="currencyCode"
                  value={settings.currencyCode || "USD"}
                  onChange={(e) => {
                    const currencyCode = e.target.value;
                    const config = getCurrencyConfig(currencyCode);

                    // Update currency code and sync symbol/position
                    handleSelectChange("currencyCode", currencyCode);
                    handleSelectChange("currencySymbol", config.symbol);
                    handleSelectChange("currencyPosition", config.symbolPosition);

                    toast.success(`Currency changed to ${config.name}`);
                  }}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {getCurrencyOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Preview: {getCurrencyConfig(settings.currencyCode).symbol}1,234.56
                  {getCurrencyConfig(settings.currencyCode).symbolPosition === "after" &&
                    getCurrencyConfig(settings.currencyCode).symbol}
                </p>
              </div>

              <div>
                <label htmlFor="loyaltyPointsPerUnit" className="block text-sm font-medium text-gray-700 mb-2">
                  Loyalty Points Rate
                </label>
                <input
                  type="number"
                  id="loyaltyPointsPerUnit"
                  min="0.01"
                  step="0.01"
                  defaultValue={settings.loyaltyPointsPerUnit || 10}
                  onBlur={(e) => handleNumberFieldChange("loyaltyPointsPerUnit", e, 0.01, 10000)}
                  disabled={saving || !settings.enableLoyaltyPoints}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="10.00"
                />
                <p className="text-sm text-gray-500 mt-1">
                  1 point per {settings.loyaltyPointsPerUnit || 10} {getCurrencyConfig(settings.currencyCode).symbol}{" "}
                  spent
                  {!settings.enableLoyaltyPoints && " (Enable Loyalty Points first)"}
                </p>
              </div>

              <div>
                <label htmlFor="pointsRedemptionRate" className="block text-sm font-medium text-gray-700 mb-2">
                  Points Redemption Rate
                </label>
                <input
                  type="number"
                  id="pointsRedemptionRate"
                  min="1"
                  step="1"
                  defaultValue={settings.pointsRedemptionRate || 100}
                  onBlur={(e) => handleNumberFieldChange("pointsRedemptionRate", e, 1, 10000)}
                  disabled={saving || !settings.enableLoyaltyPoints}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="100"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {settings.pointsRedemptionRate || 100} points = {getCurrencyConfig(settings.currencyCode).symbol}1
                  discount
                  {!settings.enableLoyaltyPoints && " (Enable Loyalty Points first)"}
                </p>
              </div>

              <div className="col-span-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-blue-800">Currency & Loyalty System</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Select your preferred currency from the dropdown. Each currency includes:</p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>
                            <strong>USD</strong> - US Dollar ($) with standard formatting
                          </li>
                          <li>
                            <strong>BDT</strong> - Bangladeshi Taka (৳) with English numerals
                          </li>
                          <li>
                            <strong>EUR, GBP, INR, JPY</strong> - Additional currencies available
                          </li>
                        </ul>
                        <p className="mt-2">
                          The currency will be applied across all prices, reports, and receipts in the system.
                        </p>
                        <p className="mt-2 font-medium">
                          <strong>Earning Points:</strong> Customers earn 1 point per{" "}
                          {settings.loyaltyPointsPerUnit || 10} {getCurrencyConfig(settings.currencyCode).symbol} spent.
                        </p>
                        <p className="mt-1 font-medium">
                          <strong>Redeeming Points:</strong> {settings.pointsRedemptionRate || 100} points ={" "}
                          {getCurrencyConfig(settings.currencyCode).symbol}1 discount.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">🔔 Alerts & Notifications</h2>
              <p className="text-sm text-gray-600 mt-1">Manage inventory alerts and notifications</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Alert Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Low Stock Alert */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Low Stock Alerts</h4>
                    <p className="text-sm text-gray-500">Notify when inventory is low</p>
                  </div>
                  <button
                    onClick={() => handleToggle("enableLowStockAlerts", !settings.enableLowStockAlerts)}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      settings.enableLowStockAlerts ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                        settings.enableLowStockAlerts ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* High Stock Alert */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">High Stock Alerts</h4>
                    <p className="text-sm text-gray-500">Notify when inventory is too high</p>
                  </div>
                  <button
                    onClick={() => handleToggle("enableHighStockAlerts", !(settings.enableHighStockAlerts ?? false))}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      settings.enableHighStockAlerts ?? false ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                        settings.enableHighStockAlerts ?? false ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Product Expiry Alert */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Product Expiry Alerts</h4>
                    <p className="text-sm text-gray-500">Notify when products are near expiry</p>
                  </div>
                  <button
                    onClick={() =>
                      handleToggle("enableProductExpiryAlerts", !(settings.enableProductExpiryAlerts ?? false))
                    }
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      settings.enableProductExpiryAlerts ?? false ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                        settings.enableProductExpiryAlerts ?? false ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Daily Sales Target Alert */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Daily Sales Target Alert</h4>
                    <p className="text-sm text-gray-500">Notify when daily sales target is reached</p>
                  </div>
                  <button
                    onClick={() =>
                      handleToggle("dailySalesTargetAlertEnabled", !(settings.dailySalesTargetAlertEnabled ?? false))
                    }
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      settings.dailySalesTargetAlertEnabled ?? false ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                        settings.dailySalesTargetAlertEnabled ?? false ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Price Change Alert */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Price Change Alert</h4>
                    <p className="text-sm text-gray-500">Notify when a product price is changed</p>
                  </div>
                  <button
                    onClick={() =>
                      handleToggle("priceChangeAlertEnabled", !(settings.priceChangeAlertEnabled ?? false))
                    }
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      settings.priceChangeAlertEnabled ?? false ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                        settings.priceChangeAlertEnabled ?? false ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                  {/* Inactive Product Alert */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Inactive Product Alert</h4>
                      <p className="text-sm text-gray-500">Notify if a product has not sold for X days</p>
                    </div>
                    <button
                      onClick={() =>
                        handleToggle("inactiveProductAlertEnabled", !(settings.inactiveProductAlertEnabled ?? false))
                      }
                      disabled={saving}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                        settings.inactiveProductAlertEnabled ?? false ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                          settings.inactiveProductAlertEnabled ?? false ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                    {/* Low Balance Alert */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Low Balance Alert</h4>
                        <p className="text-sm text-gray-500">Notify when cash drawer balance falls below threshold</p>
                      </div>
                      <button
                        onClick={() =>
                          handleToggle("lowBalanceAlertEnabled", !(settings.lowBalanceAlertEnabled ?? false))
                        }
                        disabled={saving}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                          settings.lowBalanceAlertEnabled ?? false ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                            settings.lowBalanceAlertEnabled ?? false ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                  {/* Supplier Delivery Alert */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Supplier Delivery Alert</h4>
                      <p className="text-sm text-gray-500">Notify if supplier delivery is overdue</p>
                    </div>
                    <button
                      onClick={() =>
                        handleToggle("supplierDeliveryAlertEnabled", !(settings.supplierDeliveryAlertEnabled ?? false))
                      }
                      disabled={saving}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                        settings.supplierDeliveryAlertEnabled ?? false ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                          settings.supplierDeliveryAlertEnabled ?? false ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
              </div>

              {/* Low Stock Threshold */}
              <div>
                <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  id="lowStockThreshold"
                  min="1"
                  max="1000"
                  defaultValue={settings.lowStockThreshold}
                  onBlur={(e) => handleNumberFieldChange("lowStockThreshold", e, 1, 1000)}
                  disabled={saving}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <p className="text-sm text-gray-500 mt-1">Alert when product stock falls below this number</p>
              </div>

              {/* High Stock Threshold */}
              <div>
                <label htmlFor="highStockThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                  High Stock Threshold
                </label>
                <input
                  type="number"
                  id="highStockThreshold"
                  min="10"
                  max="10000"
                  defaultValue={settings.highStockThreshold || 1000}
                  onBlur={(e) => handleNumberFieldChange("highStockThreshold", e, 10, 10000)}
                  disabled={saving}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <p className="text-sm text-gray-500 mt-1">Alert when product stock exceeds this number</p>
              </div>

              {/* Product Expiry Days */}
              <div>
                <label htmlFor="productExpiryDays" className="block text-sm font-medium text-gray-700 mb-2">
                  Days Before Expiry to Alert
                </label>
                <input
                  type="number"
                  id="productExpiryDays"
                  min="1"
                  max="365"
                  defaultValue={settings.productExpiryDays || 7}
                  onBlur={(e) => handleNumberFieldChange("productExpiryDays", e, 1, 365)}
                  disabled={saving || !(settings.enableProductExpiryAlerts ?? false)}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <p className="text-sm text-gray-500 mt-1">Alert when a product is within this many days of expiry</p>
              </div>

              {/* Daily Sales Target Amount */}
              <div>
                <label htmlFor="dailySalesTargetAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Sales Target Amount
                </label>
                <input
                  type="number"
                  id="dailySalesTargetAmount"
                  min="1"
                  step="1"
                  defaultValue={settings.dailySalesTargetAmount || 1000}
                  onBlur={(e) => handleNumberFieldChange("dailySalesTargetAmount", e, 1)}
                  disabled={saving || !(settings.dailySalesTargetAlertEnabled ?? false)}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <p className="text-sm text-gray-500 mt-1">Set the daily sales target amount for alert notification</p>
              </div>

              {/* Expected Delivery Days for Supplier Delivery Alert */}
              <div>
                <label htmlFor="expectedDeliveryDays" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Delivery Days
                </label>
                <input
                  type="number"
                  id="expectedDeliveryDays"
                  min="1"
                  max="60"
                  defaultValue={settings.expectedDeliveryDays || 7}
                  onBlur={(e) => handleNumberFieldChange("expectedDeliveryDays", e, 1, 60)}
                  disabled={saving || !(settings.supplierDeliveryAlertEnabled ?? false)}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <p className="text-sm text-gray-500 mt-1">Alert if supplier delivery is overdue by this many days</p>
              </div>

              {/* Inactive Product Days for Inactive Product Alert */}
              <div>
                <label htmlFor="inactiveProductDays" className="block text-sm font-medium text-gray-700 mb-2">
                  Inactive Product Days
                </label>
                <input
                  type="number"
                  id="inactiveProductDays"
                  min="1"
                  max="365"
                  defaultValue={settings.inactiveProductDays || 30}
                  onBlur={(e) => handleNumberFieldChange("inactiveProductDays", e, 1, 365)}
                  disabled={saving || !(settings.inactiveProductAlertEnabled ?? false)}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <p className="text-sm text-gray-500 mt-1">Alert if a product has not sold for this many days</p>
              </div>

              {/* Low Balance Threshold for Low Balance Alert */}
              <div>
                <label htmlFor="lowBalanceThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                  Low Balance Threshold
                </label>
                <input
                  type="number"
                  id="lowBalanceThreshold"
                  min="0"
                  step="0.01"
                  defaultValue={settings.lowBalanceThreshold || 100}
                  onBlur={(e) => handleNumberFieldChange("lowBalanceThreshold", e, 0)}
                  disabled={saving || !(settings.lowBalanceAlertEnabled ?? false)}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <p className="text-sm text-gray-500 mt-1">Alert when cash drawer balance falls below this amount</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">⚙️ System Settings</h2>
              <p className="text-sm text-gray-600 mt-1">Security and system preferences</p>
            </div>

            <div className="p-6 space-y-6">
              {/* System Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Require Password on Void</h4>
                    <p className="text-sm text-gray-500">Admin approval for void transactions</p>
                  </div>
                  <button
                    onClick={() => handleToggle("requirePasswordOnVoid", !settings.requirePasswordOnVoid)}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      settings.requirePasswordOnVoid ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                        settings.requirePasswordOnVoid ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Audit Log</h4>
                    <p className="text-sm text-gray-500">Track all system actions</p>
                  </div>
                  <button
                    onClick={() => handleToggle("enableAuditLog", !settings.enableAuditLog)}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      settings.enableAuditLog ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                        settings.enableAuditLog ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Show Product Images</h4>
                    <p className="text-sm text-gray-500">Display images in POS</p>
                  </div>
                  <button
                    onClick={() => handleToggle("showProductImages", !settings.showProductImages)}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      settings.showProductImages ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                        settings.showProductImages ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Numeric Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="autoLogoutMinutes" className="block text-sm font-medium text-gray-700 mb-2">
                    Auto Logout (Minutes)
                  </label>
                  <input
                    type="number"
                    id="autoLogoutMinutes"
                    min="5"
                    max="240"
                    defaultValue={settings.autoLogoutMinutes}
                    onBlur={(e) => handleNumberFieldChange("autoLogoutMinutes", e, 5, 240)}
                    disabled={saving}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <p className="text-sm text-gray-500 mt-1">Auto-logout after inactivity</p>
                </div>

                <div>
                  <label htmlFor="productsPerPage" className="block text-sm font-medium text-gray-700 mb-2">
                    Products Per Page
                  </label>
                  <input
                    type="number"
                    id="productsPerPage"
                    min="10"
                    max="100"
                    defaultValue={settings.productsPerPage}
                    onBlur={(e) => handleNumberFieldChange("productsPerPage", e, 10, 100)}
                    disabled={saving}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <p className="text-sm text-gray-500 mt-1">Number of products per page</p>
                </div>

                <div>
                  <label htmlFor="defaultView" className="block text-sm font-medium text-gray-700 mb-2">
                    Default Product View
                  </label>
                  <select
                    id="defaultView"
                    value={settings.defaultView}
                    onChange={(e) => handleSelectChange("defaultView", e.target.value)}
                    disabled={saving}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="grid">Grid View</option>
                    <option value="list">List View</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Modal */}
        {showInfoModal && selectedFeature && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {(() => {
                const feature = featureToggles.find((f) => f.key === selectedFeature);
                if (!feature) return null;

                return (
                  <>
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{feature.icon}</span>
                          <div>
                            <h2 className="text-2xl font-bold">{feature.title}</h2>
                            <p className="text-blue-100 text-sm mt-1">{feature.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setShowInfoModal(false);
                            setSelectedFeature(null);
                          }}
                          className="text-white hover:text-gray-200 transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                      {/* What is it? */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
                          <span className="text-blue-600">📘</span>
                          What is it?
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{feature.detailedInfo.whatIs}</p>
                      </div>

                      {/* How it works */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
                          <span className="text-green-600">⚙️</span>
                          How it works
                        </h3>
                        <ol className="space-y-2">
                          {feature.detailedInfo.howItWorks.map((step, index) => (
                            <li key={index} className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </span>
                              <span className="text-gray-700 pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* When to use */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-green-900 flex items-center gap-2 mb-2">
                          <span>✅</span>
                          When to Enable
                        </h3>
                        <p className="text-green-800">{feature.detailedInfo.whenToUse}</p>
                      </div>

                      {/* When to disable */}
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-orange-900 flex items-center gap-2 mb-2">
                          <span>❌</span>
                          When to Disable
                        </h3>
                        <p className="text-orange-800">{feature.detailedInfo.whenToDisable}</p>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowInfoModal(false);
                          setSelectedFeature(null);
                        }}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Got it!
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;

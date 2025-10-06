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
            featureToggles={featureToggles}
            settings={settings}
            saving={saving}
            handleToggle={handleToggleString}
            setSelectedFeature={setSelectedFeature}
            setShowInfoModal={setShowInfoModal}
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
            alertTypes={[
              {
                key: "lowStock",
                label: "Low Stock",
                description: "Notify when inventory is low",
                min: 1,
                max: 1000,
                unit: "qty",
              },
              {
                key: "highStock",
                label: "High Stock",
                description: "Notify when inventory is too high",
                min: 10,
                max: 10000,
                unit: "qty",
              },
              {
                key: "productExpiry",
                label: "Product Expiry",
                description: "Notify when products are near expiry",
                min: 1,
                max: 365,
                unit: "days",
              },
              {
                key: "dailySalesTarget",
                label: "Daily Sales Target",
                description: "Notify when daily sales target is reached",
                min: 1,
                unit: "amount",
              },
              { key: "priceChange", label: "Price Change", description: "Notify when a product price is changed" },
              {
                key: "inactiveProduct",
                label: "Inactive Product",
                description: "Notify if a product has not sold for X days",
                min: 1,
                max: 365,
                unit: "days",
              },
              {
                key: "lowBalance",
                label: "Low Balance",
                description: "Notify when cash drawer balance falls below threshold",
                min: 0,
                unit: "amount",
              },
              {
                key: "frequentRefunds",
                label: "Frequent Refunds",
                description: "Notify if refunds exceed threshold in a day",
                min: 1,
                unit: "count",
              },
              {
                key: "supplierDelivery",
                label: "Supplier Delivery",
                description: "Notify if supplier delivery is overdue",
                min: 1,
                max: 60,
                unit: "days",
              },
              {
                key: "loyaltyPointsExpiry",
                label: "Loyalty Points Expiry",
                description: "Notify customers before their loyalty points expire",
                min: 1,
                unit: "days",
              },
              {
                key: "systemErrorAlert",
                label: "System Error/Failure",
                description: "Notify admins when a critical system error occurs",
              },
            ]}
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

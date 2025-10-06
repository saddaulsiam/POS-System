import React from "react";

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabList = [
  { key: "profile", label: "🙍 Profile" },
  { key: "features", label: "🎯 POS Features" },
  { key: "store", label: "🏪 Store Info" },
  { key: "receipt", label: "🧾 Receipts" },
  { key: "finance", label: "💰 Tax & Currency" },
  { key: "alerts", label: "🔔 Alerts" },
  { key: "system", label: "⚙️ System" },
];

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, setActiveTab }) => (
  <div className="bg-white rounded-lg shadow mb-6">
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  </div>
);

export default SettingsTabs;

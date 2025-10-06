import React from "react";

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabList = [
  { key: "profile", label: "🙍 Profile" },
  { key: "features", label: "🎯 POS Features" },
  { key: "receipt", label: "🧾 Receipts" },
  { key: "finance", label: "💰 Tax & Currency" },
  { key: "alerts", label: "🔔 Alerts" },
  { key: "system", label: "⚙️ System" },
];

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, setActiveTab }) => (
  <div className="sticky top-0 z-20 bg-white/90 backdrop-blur shadow-sm mb-6 rounded-b-lg">
    <div className="border-b border-gray-200 px-2">
      <nav className="flex -mb-px overflow-x-auto gap-2 py-2" aria-label="Tabs">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors
              ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow border border-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50 border border-transparent"
              }
            `}
            aria-current={activeTab === tab.key ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  </div>
);

export default SettingsTabs;

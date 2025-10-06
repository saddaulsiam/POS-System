import React from "react";

interface SystemTabProps {
  settings: any;
  saving: boolean;
  handleSwitchChange: (field: string, value: boolean) => void;
  handleNumberFieldChange: (field: string, e: React.FocusEvent<HTMLInputElement>, min?: number, max?: number) => void;
  handleSelectChange: (field: string, value: string) => void;
}

const SystemTab: React.FC<SystemTabProps> = ({
  settings,
  saving,
  handleSwitchChange,
  handleNumberFieldChange,
  handleSelectChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">⚙️ System</h2>
        <p className="text-sm text-gray-600 mt-1">System preferences and advanced options</p>
      </div>
      <div className="space-y-4 p-6">
        {/* System Error Alerts Toggle */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
          <div>
            <span className="font-medium text-gray-900">System Error Alerts</span>
            <p className="text-sm text-gray-600 mt-1">Receive alerts for system errors or failures</p>
          </div>
          <button
            type="button"
            onClick={() => handleSwitchChange("systemErrorAlertEnabled", !settings.systemErrorAlertEnabled)}
            disabled={saving}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
              settings.systemErrorAlertEnabled ? "bg-blue-600" : "bg-gray-200"
            }`}
            role="switch"
            aria-checked={!!settings.systemErrorAlertEnabled}
            id="systemErrorAlertEnabled"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                settings.systemErrorAlertEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        {/* Daily Sales Target Input */}
        <div className="p-4 border border-gray-200 rounded-lg bg-white">
          <label htmlFor="dailySalesTarget" className="block text-sm font-medium text-gray-900 mb-1">
            Daily Sales Target
          </label>
          <input
            type="number"
            id="dailySalesTarget"
            min="0"
            step="1"
            defaultValue={settings.dailySalesTarget || 0}
            onBlur={(e) => handleNumberFieldChange("dailySalesTarget", e, 0)}
            disabled={saving}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="0"
          />
          <p className="text-sm text-gray-500 mt-1">Set a daily sales target for your store</p>
        </div>
        {/* High Stock Alert Threshold Input */}
        <div className="p-4 border border-gray-200 rounded-lg bg-white">
          <label htmlFor="highStockAlertThreshold" className="block text-sm font-medium text-gray-900 mb-1">
            High Stock Alert Threshold
          </label>
          <input
            type="number"
            id="highStockAlertThreshold"
            min="1"
            step="1"
            defaultValue={settings.highStockAlertThreshold || 100}
            onBlur={(e) => handleNumberFieldChange("highStockAlertThreshold", e, 1)}
            disabled={saving}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="100"
          />
          <p className="text-sm text-gray-500 mt-1">Alert when stock exceeds this quantity</p>
        </div>
        <div className="col-span-2">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-gray-800">System Preferences</h3>
                <div className="mt-2 text-sm text-gray-700">
                  <p>Configure advanced system options and alerts for your POS system.</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Auto print receipts for faster checkout</li>
                    <li>Receive alerts for system errors and failures</li>
                    <li>Set daily sales targets and high stock alerts</li>
                  </ul>
                  <p className="mt-2">These settings help automate and monitor your store operations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemTab;

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
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="autoPrintThermal" className="block text-sm font-medium text-gray-700 mb-2">
            Auto Print Thermal Receipts
          </label>
          <input
            type="checkbox"
            id="autoPrintThermal"
            checked={!!settings.autoPrintThermal}
            onChange={(e) => handleSwitchChange("autoPrintThermal", e.target.checked)}
            disabled={saving}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <p className="text-sm text-gray-500 mt-1">Automatically print receipts after each sale</p>
        </div>
        <div>
          <label htmlFor="systemErrorAlertEnabled" className="block text-sm font-medium text-gray-700 mb-2">
            System Error Alerts
          </label>
          <input
            type="checkbox"
            id="systemErrorAlertEnabled"
            checked={!!settings.systemErrorAlertEnabled}
            onChange={(e) => handleSwitchChange("systemErrorAlertEnabled", e.target.checked)}
            disabled={saving}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <p className="text-sm text-gray-500 mt-1">Receive alerts for system errors or failures</p>
        </div>
        <div>
          <label htmlFor="dailySalesTarget" className="block text-sm font-medium text-gray-700 mb-2">
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
        <div>
          <label htmlFor="highStockAlertThreshold" className="block text-sm font-medium text-gray-700 mb-2">
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

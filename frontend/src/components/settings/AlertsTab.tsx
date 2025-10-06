import React from "react";

interface AlertsTabProps {
  settings: any;
  saving: boolean;
  handleSwitchChange: (field: string, value: boolean) => void;
  handleNumberFieldChange: (field: string, e: React.FocusEvent<HTMLInputElement>, min?: number, max?: number) => void;
  handleSelectChange: (field: string, value: string) => void;
}

const alertTypes = [
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
];

const AlertsTab: React.FC<AlertsTabProps> = ({
  settings,
  saving,
  handleSwitchChange,
  handleNumberFieldChange,
  handleSelectChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">🔔 Alerts & Notifications</h2>
        <p className="text-sm text-gray-600 mt-1">Configure system alerts and notification preferences</p>
      </div>
      <div className="space-y-4 p-6">
        {alertTypes.map((alert) => (
          <div
            key={alert.key}
            className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">{alert.label}</span>
                <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
              </div>
              <button
                type="button"
                onClick={() => handleSwitchChange(`${alert.key}Enabled`, !settings[`${alert.key}Enabled`])}
                disabled={saving}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  settings[`${alert.key}Enabled`] ? "bg-blue-600" : "bg-gray-200"
                }`}
                role="switch"
                aria-checked={!!settings[`${alert.key}Enabled`]}
                id={alert.key}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                    settings[`${alert.key}Enabled`] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            {typeof settings[`${alert.key}Threshold`] !== "undefined" && (
              <input
                type="number"
                id={`${alert.key}Threshold`}
                min={alert.min || 0}
                max={alert.max}
                step="1"
                defaultValue={settings[`${alert.key}Threshold`]}
                onBlur={(e) => handleNumberFieldChange(`${alert.key}Threshold`, e, alert.min, alert.max)}
                disabled={saving || !settings[`${alert.key}Enabled`]}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder={alert.unit ? `Enter value (${alert.unit})` : "Enter value"}
              />
            )}
          </div>
        ))}
        <div className="col-span-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">Alert System</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Enable or disable alerts for important events. Thresholds can be set for each alert type.</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {alertTypes.map((alert) => (
                      <li key={alert.key}>
                        <strong>{alert.label}:</strong> {alert.description}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2">
                    You will receive notifications in-app and via email (if configured) when an alert is triggered.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsTab;

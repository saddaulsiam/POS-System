import React from "react";

interface AlertsTabProps {
  settings: any;
  saving: boolean;
  handleSwitchChange: (field: string, value: boolean) => void;
  handleNumberFieldChange: (field: string, e: React.FocusEvent<HTMLInputElement>, min?: number, max?: number) => void;
  handleSelectChange: (field: string, value: string) => void;
  alertTypes: Array<{ key: string; label: string; description: string; min?: number; max?: number; unit?: string }>;
}

const AlertsTab: React.FC<AlertsTabProps> = ({
  settings,
  saving,
  handleSwitchChange,
  handleNumberFieldChange,
  handleSelectChange,
  alertTypes,
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">🔔 Alerts & Notifications</h2>
        <p className="text-sm text-gray-600 mt-1">Configure system alerts and notification preferences</p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {alertTypes.map((alert) => (
          <div key={alert.key} className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={alert.key} className="text-sm font-medium text-gray-700">
                {alert.label}
              </label>
              <input
                type="checkbox"
                id={alert.key}
                checked={!!settings[`${alert.key}Enabled`]}
                onChange={(e) => handleSwitchChange(`${alert.key}Enabled`, e.target.checked)}
                disabled={saving}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </div>
            <p className="text-xs text-gray-500 mb-1">{alert.description}</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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

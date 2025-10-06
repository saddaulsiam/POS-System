import React from "react";

interface SystemTabProps {
  settings: any;
  saving: boolean;
  handleTextFieldChange: (field: string, e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SystemTab: React.FC<SystemTabProps> = ({ settings, saving, handleTextFieldChange }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">⚙️ System</h2>
        <p className="text-sm text-gray-600 mt-1">System preferences and business/store information</p>
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
  );
};

export default SystemTab;

import React from "react";

interface FinanceTabProps {
  settings: any;
  saving: boolean;
  handleNumberFieldChange: (field: string, e: React.FocusEvent<HTMLInputElement>, min?: number, max?: number) => void;
  handleSelectChange: (field: string, value: string) => void;
}

const FinanceTab: React.FC<FinanceTabProps> = ({ settings, saving, handleNumberFieldChange, handleSelectChange }) => {
  const getCurrencyConfig = (code: string) => {
    // You may want to import this from config/currencyConfig in your real code
    return { symbol: "$", symbolPosition: "before", name: code };
  };
  const getCurrencyOptions = () => [
    { value: "USD", label: "USD - US Dollar ($)" },
    { value: "BDT", label: "BDT - Bangladeshi Taka (৳)" },
    { value: "EUR", label: "EUR - Euro (€)" },
    { value: "GBP", label: "GBP - British Pound (£)" },
    { value: "INR", label: "INR - Indian Rupee (₹)" },
    { value: "JPY", label: "JPY - Japanese Yen (¥)" },
  ];
  return (
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
              handleSelectChange("currencyCode", currencyCode);
              handleSelectChange("currencySymbol", config.symbol);
              handleSelectChange("currencyPosition", config.symbolPosition);
              // toast.success(`Currency changed to ${config.name}`); // Optionally handle toast in parent
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
            1 point per {settings.loyaltyPointsPerUnit || 10} {getCurrencyConfig(settings.currencyCode).symbol} spent
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
            {settings.pointsRedemptionRate || 100} points = {getCurrencyConfig(settings.currencyCode).symbol}1 discount
            {!settings.enableLoyaltyPoints && " (Enable Loyalty Points first)"}
          </p>
        </div>
        <div className="col-span-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
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
                    <strong>Earning Points:</strong> Customers earn 1 point per {settings.loyaltyPointsPerUnit || 10}{" "}
                    {getCurrencyConfig(settings.currencyCode).symbol} spent.
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
  );
};

export default FinanceTab;
